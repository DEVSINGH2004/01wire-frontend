import { getImageUrl } from "utils/apiConfig";

const DisplayImage = ({
  src,
  height,
  width,
  styles,
  ...rest
}: {
  src: string;
  height: string;
  width: string;
  styles?: object;
  [key: string]: any;
}) => {
  return (
    <img src={getImageUrl(src)} height={height} width={width} style={{ ...styles }} {...rest} />
  );
};
export default DisplayImage;
