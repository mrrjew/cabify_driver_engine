export const generateQuery = (filters?: any, sort?: any, pagination?: any, search?: any) => {
  const query = {};

  if (filters) {
    for (const key in filters) {
      if (filters.hasOwnProperty(key)) {
        // Checking if the value of the field is an object with a comparison operator
        if (typeof filters[key] === 'object' && Object.keys(filters[key]).length === 1) {
          const operator = Object.keys(filters[key])[0];
          const value = filters[key][operator];

          // Constructing the MongoDB query operator dynamically
          query[key] = { [`$${operator}`]: value };
        } else {
          // If no comparison operator is provided, treat it as an equality comparison
          query[key] = filters[key];
        }
      }
    }
  }

  // search
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query['$or'] = [
      { name: { $regex: searchRegex } },
      { description: { $regex: searchRegex } },
      { location: { $regex: searchRegex } },
    ];
  }

  // sort
  let sortCriteria = {};
  if (sort) {
    sortCriteria = sort;
  }

  //apply pagination if provided
  let { limit, offset } = pagination;
  limit = limit || 10 ;
  offset = offset || 0;

  return {
    query,sortCriteria,limit,offset,
  }
};

