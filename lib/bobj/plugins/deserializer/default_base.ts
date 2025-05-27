import type { DeserializerPluginType } from "../../types/deserializerPlugin";
import { u8iToNumber } from "../../utils/number_u8i_converter";

const useDefaultBaseDeserializerPluginGroup: () => DeserializerPluginType<any>[] = () => {
    return [
        {
            filter: new Uint8Array([2]),
            deserialize: (props) => {
                return new Uint8Array(props.targetArray);
            }
        },
        {
            filter: new Uint8Array([4]),
            deserialize: (props) => {
                return u8iToNumber(props.targetArray)
            }
        }, {
            filter: new Uint8Array([5]),
            deserialize: (props) => {
                return props.targetArray[0] === 0x01;
            }
        }, {
            filter: new Uint8Array([6]),
            deserialize: (_) => {
                return undefined;
            }
        }, {
            filter: new Uint8Array([7]),
            deserialize: (_) => {
                return null;
            }
        }
    ]
};

export default useDefaultBaseDeserializerPluginGroup;