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
    <img
      src={`${process.env.REACT_APP_IMAGE_BASE_URL}${src}`}
      height={height}
      width={width}
      style={{ ...styles }}
      {...rest}
    />
  );
};
export default DisplayImage;
