import bytes2int from "./bytes2int";
// import cachedFunction from "./cachedFunction";

export default function decodeBobjItem(props: { targetArray: Uint8Array, textDecoder?: TextDecoder }) {
    const { targetArray, textDecoder: decoder = new TextDecoder() } = props;
    const keyByteLength = targetArray[0];
    const valueTypeByteLength = targetArray[1];
    const valueByteLength = targetArray[2];
    const keyByte = decoder.decode(targetArray.slice(3, 3 + keyByteLength));
    // const valueTypeByte = cachedFunction(_ => decoder.decode(_))([targetArray.slice(3 + keyByteLength, 3 + keyByteLength + valueTypeByteLength)], targetArray.slice(3 + keyByteLength, 3 + keyByteLength + valueTypeByteLength).reduce((prev, curr) => `${prev}${curr}`, ""));
    const valueTypeByte = targetArray.slice(3 + keyByteLength, 3 + keyByteLength + valueTypeByteLength);
    const valueLengthByte = targetArray.slice(3 + keyByteLength + valueTypeByteLength, 3 + keyByteLength + valueTypeByteLength + valueByteLength);
    const valueLnegth = bytes2int(valueLengthByte);
    const valueByte = targetArray.slice(3 + keyByteLength + valueTypeByteLength + valueByteLength, 3 + keyByteLength + valueTypeByteLength + valueByteLength + valueLnegth);
    return { key: keyByte, valueType: valueTypeByte, value: valueByte, totalLength: 3 + keyByteLength + valueTypeByteLength + valueByteLength + valueLnegth };
}