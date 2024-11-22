import Image from 'next/image';

const avatarMap: { [key: number]: any } = {
    1: require("@/frontend/assets/images/avatars/avatar-1.webp"),
    2: require("@/frontend/assets/images/avatars/avatar-2.webp"),
    3: require("@/frontend/assets/images/avatars/avatar-3.webp"),
    4: require("@/frontend/assets/images/avatars/avatar-4.webp"),
    5: require("@/frontend/assets/images/avatars/avatar-5.webp"),
};

interface AvatarProps {
    avatarId: number;
    width: number;
    height: number;
    className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
    avatarId,
    width,
    height,
    className,
}) => {
    const avatarSrc = avatarMap[avatarId];
    return (
        <Image
            src={avatarSrc}
            alt={`Avatar ${avatarId}`}
            className={className}
            width={width}
            height={height}
        />
    );
};

export default Avatar;
