import { DataTypes } from "https://deno.land/x/denodb@v1.0.39/mod.ts";

const resourceFields = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  description: DataTypes.STRING,
  author: {
    type: DataTypes.STRING,
    allowNull: true,
  },
};

export default resourceFields;
