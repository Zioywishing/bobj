import type Serializer from "../../Serializer";
import type { SerializerPluginType } from "../../types/serializerPlugin";
// import buildBobjEl from "../../utils/buildBobjEl";
import { numberToU8i } from "../../utils/number_u8i_converter";
// import promiseResult from "../../utils/promiseResult";

const useDefaultSerializerPluginGroupBase: () => SerializerPluginType<any>[] = () => {
    return [
        {
            Constructor: Uint8Array,
            targetType: new Uint8Array([2]),
            serialize(props: { target: Uint8Array; serializer: Serializer; }) {
                return props.target;
            }
        }, {
            Constructor: "number",
            targetType: new Uint8Array([4]),
            serialize(props: { target: number; }) {
                return numberToU8i(props.target);
            }
        }, {
            Constructor: "boolean",
            targetType: new Uint8Array([5]),
            serialize(props: { target: boolean; }) {
                return new Uint8Array([props.target ? 1 : 0]);
            }
        }, {
            Constructor: "undefined",
            targetType: new Uint8Array([6]),
            serialize() {
                return new Uint8Array(0);
            }
        }, {
            filter(_) {
                return _ === null;
            },
            targetType: new Uint8Array([7]),
            serialize() {
                return new Uint8Array(0);
            }
        }
    ]
}

export default useDefaultSerializerPluginGroupBase;