class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    //console.log(keyword);

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    //console.log(queryCopy);

    //Removing filter from the query
    const removeFields = [
      "keyword",
      "page",
      "limit",
      // Vercel rewrite/system query params that should never be treated as DB filters
      "path",
      "_vercel_no_cache",
      "_vercel_jwt",
      "_vercel_sso_nonce",
    ];
    removeFields.forEach((el) => delete queryCopy[el]);

    // Ignore any internal/system query params (usually prefixed with _)
    Object.keys(queryCopy).forEach((key) => {
      if (key.startsWith("_")) {
        delete queryCopy[key];
      }
    });
    //console.log(queryCopy);

    const operators = ["gt", "gte", "lt", "lte"];
    const filters = {};

    const setOperatorFilter = (field, operator, value) => {
      if (
        !filters[field] ||
        typeof filters[field] !== "object" ||
        Array.isArray(filters[field])
      ) {
        filters[field] = {};
      }

      filters[field][`$${operator}`] = value;
    };

    Object.entries(queryCopy).forEach(([key, value]) => {
      // Handle bracket-style query params e.g. price[gte]=1, specs.memory[lte]=8
      const bracketMatch = key.match(/^(.+)\[(gt|gte|lt|lte)\]$/);

      if (bracketMatch) {
        const [, field, operator] = bracketMatch;
        setOperatorFilter(field, operator, value);
        return;
      }

      // Handle nested parser shape e.g. { price: { gte: 1, lte: 10 } }
      if (value && typeof value === "object" && !Array.isArray(value)) {
        let hasOperator = false;

        Object.entries(value).forEach(([operator, operatorValue]) => {
          if (operators.includes(operator)) {
            setOperatorFilter(key, operator, operatorValue);
            hasOperator = true;
          }
        });

        if (hasOperator) {
          return;
        }
      }

      // Plain equality filter e.g. brand=Samsung
      filters[key] = value;
    });

    this.query = this.query.find(filters);
    return this;
  }

  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;
