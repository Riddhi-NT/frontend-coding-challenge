import { HeaderTitleProps } from "../../utils/propsTypes";

const HeaderTitle = ({ title }: HeaderTitleProps) => {
  return <h1 className="text-2xl mb-2">{title}</h1>;
};

export default HeaderTitle;
