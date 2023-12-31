
export type ImageInputProps = {
  onImageUploaded?: (image: HTMLImageElement) => void,
};

export default function ImageInput(props: ImageInputProps) {
  const { onImageUploaded } = props;

  const onFileChange = async (files: FileList) => {
    console.log(files);
    
    const file = files.item(0);

    if (file && onImageUploaded) {
      const buffer = await file.arrayBuffer();

      const image = new Image();
      //image.src = 

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
    />
  )
}