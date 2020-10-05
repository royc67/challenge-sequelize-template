class MySequelize {
    constructor(connect, tableName) {
        this.connection = connect;
        this.table = tableName;
    }

    async create(obj) {
       const result = await this.connection.query(`INSERT INTO ${this.table} SET ?`, obj)

    }

    async bulkCreate(arr) {
        const results = arr.map(async (obj) => await this.connection.query(`INSERT INTO ${this.table} SET ?`, obj))
    }

    async findAll(options) {
        let results;

        let attributesQuery = '*';
        let whereQuery = '';
        let limitQuery = '';
        let orederByQuery = '';
        let includeQuery = '';
        if (options){
            if (options.hasOwnProperty('where')){
                for (let key in options.where) {
                    if (whereQuery.length>0) whereQuery += " AND ";
                    whereQuery += `${key} = '${options.where[key]}'`
                    }
                whereQuery = `WHERE ${whereQuery}`
                }
            if (options.hasOwnProperty('order')){
                orederByQuery = `ORDER BY ${options.order.join(' ')}`
            }
            
            if (options.hasOwnProperty('limit')){
                limitQuery = `LIMIT ${options.limit}`
            }
            
            if (options.hasOwnProperty('attributes')){
                let attributesArr = options.attributes.map(attribute => {
                    if (typeof attribute === 'string') return attribute;
                    if (typeof attribute === 'object') return attribute.join(' AS ');
                })
                attributesQuery = attributesArr.join(', ');
                // console.log(' att querey: ', attributesQuery)
            }
            if (options.hasOwnProperty('include')){
                const tempRes = await this.connection.query(`SELECT * FROM ${this.table}`)
                const finalRes = tempRes[0].map(async (res) => {
                    const includedRes = await this.connection.query(`SELECT * 
                                                                     FROM ${options.include.table} 
                                                                     WHERE ${options.include.tableForeignKey}=${this.table}.${res.id}`)
                    res.playlists = includedRes[0];
                })
                return finalRes;
            }
        }
        results = await this.connection.query(`
            select ${attributesQuery} 
            from ${this.table}
            ${whereQuery}
            ${includeQuery}
            ${orederByQuery}
            ${limitQuery}
            `)
        return results[0]
    }
    async findByPk(id) {

        const result = await this.connection.query(`SELECT * FROM ${this.table} WHERE id=${id} LIMIT 1`)
        
        return result[0]

    }

    async findOne(options) {
        /*
            Model.findOne({
                where: {
                    is_admin: true
                }
            })
        */
    }

    async update(newDetsils, options) {
        /*
            Model.update( { name: 'test6', email: 'test6@gmail.com' } , {
                where: {                                                      // first object containing details to update
                    is_admin: true                                            // second object containing condotion for the query
                }
            })
        */
    }

    async destroy({ force, ...options }) {
        /*
            Model.destroy({
                where: {                                                      
                    is_admin: true                                            
                },
                force: true      // will cause hard delete
            })
        */

        /*
           Model.destroy({
               where: {                                                      
                   id: 10                                           
               },
               force: false      // will cause soft delete
           })
       */
        /*
           Model.destroy({
               where: {                                                      
                   id: 10                                           
               },  // will cause soft delete
           })
       */

    }

    async restore(options) {
        /*
           Model.restore({
               where: {                                                      
                   id: 12                                          
               }
           })
       */
    }

}

module.exports = { MySequelize };