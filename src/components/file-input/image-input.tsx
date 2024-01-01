
export type ImageInputProps = {
  onImageUploaded?: (image: HTMLImageElement) => void,
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function ImageInput(props: ImageInputProps) {
  const { onImageUploaded, ...inputProps } = props;

  const onFileChange = async (files: FileList) => {   
    const file = files.item(0);

    if (file && onImageUploaded) {
      const buffer = await file.arrayBuffer();

      const image = new Image();
      const imageBlob = new Blob([buffer], {type: file.type});
      const url = URL.createObjectURL(imageBlob);
      image.src = url;

      image.onload = () => onImageUploaded && onImageUploaded(image);
    }
  };

  return (
    <input 
      type="file"
      onChange={(e) => e.target.files && onFileChange(e.target.files)} 
      accept="image/*"
      {...inputProps} 
    />
  )
}