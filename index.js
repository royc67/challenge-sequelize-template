class MySequelize {
    constructor(connect, tableName) {
        this.connection = connect;
        this.table = tableName;

        this.optionsHandler = (type ,prop) => {
            switch(type) {
                case ('where'): {
                    let query = "";
                    for (let key in prop) {
                        if (query.length>0) query += " AND ";
                        query += `${key} = '${prop[key]}'`
                        }
                    return `WHERE ${query}`
                    }
                case ('limit'): {
                    return `LIMIT ${prop}`
                }
                case ('order'): {
                    return `ORDER BY ${prop.join(' ')}`
                }
                case ('attributes'): {
                    let attributesArr = prop.map(attribute => {
                        if (typeof attribute === 'string') return attribute;
                        if (typeof attribute === 'object') return attribute.join(' AS ');
                    })
                    return attributesArr.join(', ');
                }
                case ('include'): {
                    return '';    
                }
            }    
        }
        this.queryBuilder = (options = {}) => {
            let queries = {}
            for (let type in options){
                queries[type] = this.optionsHandler(type, options[type])
            }
            return queries;
        }
    } 
    async create(obj) {
       const result = await this.connection.query(`INSERT INTO ${this.table} SET ?`, obj)

    }
    async bulkCreate(arr) {
        const results = arr.map(async (obj) => await this.connection.query(`INSERT INTO ${this.table} SET ?`, obj))
    }
    async findAll(options) {
        let results;
        let queryProps;

        if (options){
            queryProps = this.queryBuilder(options)
            results = await this.connection.query(`
                select ${(queryProps.attributes) ? queryProps.attributes : '*'} 
                from ${this.table}
                ${(queryProps.where) ? queryProps.where : ''}
                ${(queryProps.order) ? queryProps.order : ''}
                ${(queryProps.limit) ? queryProps.limit : ''}
                `)
            if (options.include) { 
                    const finalIncludedResults = await results[0].map( async (res) => {
                        const includeRes = await this.connection.query(`
                        SELECT * FROM ${options.include[0].table}
                        WHERE ${options.include[0].tableForeignKey}='${res[options.include[0].sourceForeignKey]}'
                        `)
                        console.log('includeRes[0]', includeRes[0]);
                        res.playlists = includeRes[0]
                        return res;
                    })
                    console.log('finalIncludedResults', finalIncludedResults)
                    return finalIncludedResults;
            }
        } else {
            results = await this.connection.query(`SELECT * FROM ${this.table}`)
        }

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