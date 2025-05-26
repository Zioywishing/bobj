import type { DeserializerPluginType } from "../../types/deserializerPlugin";

const fastU8iArr: DeserializerPluginType<Uint8Array> = {
    filter: new Uint8Array([2]),
    deserialize: (props) => {
        return props.targetArray;
    }
}

export default fastU8iArr;