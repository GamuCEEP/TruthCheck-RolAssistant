const itemSchema = {
  validator:{
    $jsonSchema: {
      bsonType: 'object',
      required: [
        '_id',
        'name',
        'description',
        'interactions'
      ],
      additionalProperties: false,
      properties: {
        _id: {
          bsonType: 'objectId'
        },
        name: {
          bsonType: 'string'
        },
        description: {
          bsonType: 'string'
        },
        interactions: {
          bsonType: 'array',
          items: {
            bsonType: 'objectId'
          }
        }
      }
    }
  }
}

export default itemSchema;