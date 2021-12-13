const characterSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "_id",
        "name",
        "description",
        "inventory",
        "equipment",
        "statistics",
      ],
      additionalProperties: false,
      properties: {
        _id: {
          bsonType: "objectId",
        },
        name: {
          bsonType: "string",
        },
        description: {
          bsonType: "string",
        },
        inventory: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: [
              "itemId",
              "amount",
            ],
            properties: {
              itemId: {
                bsonType: "objectId",
              },
              amount: {
                bsonType: "int",
              },
            },
          },
        },
        equipment: {
          bsonType: "array",
          items: {
            bsonType: "objectId",
          },
        },
        statistics: {
          bsonType: "object",
        },
      },
    },
  },
};

export default characterSchema;
