
# Bobj - A JavaScript Object Serialization Library  

## Introduction  
Bobj is a lightweight, extensible JavaScript library designed to serialize JavaScript objects into a binary format (bobj) and deserialize bobj binary data back into JavaScript objects. It supports built-in data types (objects, arrays, `Uint8Array`, strings, numbers, booleans, `null`, and `undefined`) and provides a plugin system for custom data type handling.  

### Key Features  
- **Multi-type Support**: Serializes/deserializes common JavaScript primitives and objects.  
- **Extensible Plugin System**: Add support for custom data types via plugins.  
- **Binary Format**: Efficient binary representation for compact storage/transmission.  


## Installation  
```bash
# Using pnpm
pnpm add bobj

# Using npm
npm install bobj
```


## Basic Usage  

### Serialization (Object → bobj Binary)  
```typescript
import { Serializer } from "bobj";

// Define an object to serialize
const exampleObj = {
  name: "Bobj",
  version: 1.0,
  tags: ["serialization", "binary"],
  active: true,
  metadata: new Uint8Array([0x01, 0x02, 0x03]),
};

// Create a serializer instance
const serializer = new Serializer();

// Serialize the object to a Uint8Array (bobj format)
const bobjBinary = await serializer.serialize(exampleObj);
// Output: Uint8Array([...binary data...])
```

### Deserialization (bobj Binary → Object)  
```typescript
import { Deserializer } from "bobj";

// Create a deserializer instance
const deserializer = new Deserializer();

// Deserialize the bobj binary back to an object
const restoredObj = await deserializer.deserialize(bobjBinary);
// Output: { name: "Bobj", version: 1.0, tags: ["serialization", "binary"], ... }
```


## Plugin Example: Custom Data Type Support  

Bobj’s plugin system allows you to extend serialization/deserialization for custom data types (e.g., `Date`, `Set`, or user-defined classes). Below is an example for handling `Date` objects.  

### Step 1: Create a Serialization Plugin  
Add a plugin to serialize `Date` objects into timestamps (stored as 8-byte floats).  

```typescript
// date-serializer-plugin.ts
import type { SerializerPluginType } from "../types/serializer";
import { numberToU8i } from "../utils/number_u8i_converter";

const DateSerializerPlugin: SerializerPluginType<Date> = {
  // Filter: Check if the target is a Date
  filter: (target) => target instanceof Date,
  // Unique type identifier
  targetType: new TextEncoder().encode("Date"),
  // Serialize Date to a timestamp (8-byte float)
  serialize: ({ target }) => {
    const timestamp = target.getTime();
    return numberToU8i(timestamp); // Convert number to Uint8Array
  },
};

export default DateSerializerPlugin;
```

### Step 2: Create a Deserialization Plugin  
Add a plugin to deserialize 8-byte floats back into `Date` objects.  

```typescript
// date-deserializer-plugin.ts
import type { DeserializerPluginType } from "../types/deserializer";
import { u8iToNumber } from "../utils/number_u8i_converter";

const DateDeserializerPlugin: DeserializerPluginType<Date> = {
  // Filter: Check if the value type is "Date"
  filter: new TextEncoder().encode("Date"),
  // Deserialize Uint8Array to Date
  deserialize: ({ targetArray }) => {
    const timestamp = u8iToNumber(targetArray); // Convert Uint8Array to number
    return new Date(timestamp);
  },
};

export default DateDeserializerPlugin;
```

### Step 3: Register Plugins  
Register the plugins with the `Serializer` and `Deserializer` to enable custom handling.  

```typescript
import { Serializer, Deserializer } from "bobj";
import DateSerializerPlugin from "./date-serializer-plugin";
import DateDeserializerPlugin from "./date-deserializer-plugin";

// Initialize serializer with the Date plugin
const serializer = new Serializer();
serializer.registerPlugin(DateSerializerPlugin);

// Initialize deserializer with the Date plugin
const deserializer = new Deserializer();
deserializer.registerPlugin(DateDeserializerPlugin);

// Test with a Date object
const testDate = {date: new Date("2024-01-01")};
const dateBinary = await serializer.serialize(testDate); // Uint8Array([...timestamp bytes...])
const restoredDate = await deserializer.deserialize(dateBinary); // { date: Date("2024-01-01") }
```


## bobj Binary Format Specification  
Each element in the bobj binary follows this structure:  

| 8 bits       | 8 bits       | 8 bits       | Variable bits | Variable bits | Variable bits | Variable bits |
|--------------|--------------|--------------|---------------|---------------|---------------|---------------|
| Key length   | Value type length | Value length length | Key           | Value type    | Value length  | Value data    |  

- **Key length**: Length of the key (in bytes, 0-255).  
- **Value type length**: Length of the value type identifier (e.g., "Number", "Date", in bytes, 0-255).  
- **Value length length**: Length of the value length field (in bytes, 0-255).  
- **Key**: UTF-8 encoded key string.  
- **Value type**: UTF-8 encoded type identifier (e.g., "String", "Array").  
- **Value length**: Binary representation of the value data length (converted via `int2bytes`).  
- **Value data**: Binary data of the value (e.g., string bytes, number bytes).  


## License  
MIT © [MiaoSpring](https://github.com/Zioywishing)