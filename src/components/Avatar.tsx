interface AvatarProps {
  width: number;
  borderRadius?: number | string;
  fontSize?: number;
  fontWeight?: number | string;
  data: {
    name: string;
    image?: string | null;
  };
}

const Avatar = ({
  borderRadius = '50%',
  fontSize = 25,
  fontWeight = 600,
  width,
  data,
}: AvatarProps) => {
  const { name, image } = data;

  if (image)
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        style={{ width, height: width, borderRadius }}
        className="overflow-hidden object-cover"
        src={image}
        alt={name}
      />
    );

  return (
    <div
      style={{
        width,
        borderRadius,
        fontSize: `${fontSize}px`,
        fontWeight,
        backgroundImage: 'linear-gradient(white -300%, var(--accent-color))',
      }}
      className="shrink-0 aspect-square uppercase text-white font-sans-serif font-medium flex items-center justify-center"
    >
      <div className="leading-[2] select-none">{name ? name[0] : ''}</div>
    </div>
  );
};

export default Avatar;
