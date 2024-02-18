import { getNameInitials } from "@/utilities";
import { Avatar, AvatarProps } from "antd";

type props = AvatarProps & {
  name: string | undefined;
};

export const CustomAvatar = ({ name, style, ...rest }: props) => {
  return (
    <div>
      <Avatar
        alt={name}
        size="small"
        style={{
          backgroundColor: "#87d068",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "none",
          ...style
        }}
        {...rest}        
      >
        {getNameInitials(name || "")}
      </Avatar>
    </div>
  );
};
