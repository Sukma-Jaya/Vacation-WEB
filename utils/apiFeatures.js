class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    filter() {
      const queryObj = {...this.queryString};
      
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach( el => delete queryObj[el]);
  
      // 1.b) Advanced Filtering
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
      
      this.query = this.query.find(JSON.parse(queryStr));
      // menampilkan semua hasil objek
      return this;  
    }
  
    sort() {
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort('-createdAt');
      }
  
      
      // menampilkan semua hasil objek
      return this;  
    }
  
    limitFields() {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        // menghilangkan variabel __v bawaan pada MongoDB
        this.query = this.query.select('-__v');
      }
  
      return this;
    }
  
    paginate() {
      const page = this.queryString.page * 1 || 1; // string * 1 (trik untuk merubah string menjadi angka)
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;
  
      this.query = this.query.skip(skip).limit(limit);
  
      return this;
    }
  }
  
module.exports = APIFeatures;  