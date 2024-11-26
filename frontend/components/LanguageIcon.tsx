import React from "react";
import CppSvg from "@/frontend/assets/images/languages/cpp.svg";
import CSvg from "@/frontend/assets/images/languages/c.svg";
import PythonSvg from "@/frontend/assets/images/languages/python.svg";
import JavaSvg from "@/frontend/assets/images/languages/java.svg";
import JsSvg from "@/frontend/assets/images/languages/js.svg";
import TsSvg from "@/frontend/assets/images/languages/ts.svg";
import CSharpSvg from "@/frontend/assets/images/languages/c-sharp.svg";
import RubySvg from "@/frontend/assets/images/languages/ruby.svg";
import PhpSvg from "@/frontend/assets/images/languages/php.svg";
import ObjectiveCSvg from "@/frontend/assets/images/languages/objective-c.svg";
import GoSVG from "@/frontend/assets/images/languages/go.svg";

interface LanguageIconProps {
    language: string;
    width?: number;
    height?: number;
}

const languageMap: {
    [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
} = {
    "C++": CppSvg,
    C: CSvg,
    Python: PythonSvg,
    Java: JavaSvg,
    JS: JsSvg,
    TS: TsSvg,
    "C#": CSharpSvg,
    Ruby: RubySvg,
    PHP: PhpSvg,
    "Objective-C": ObjectiveCSvg,
    Go: GoSVG,
};

const LanguageIcon: React.FC<LanguageIconProps> = ({
    language,
    width = 24,
    height = 24,
}) => {
    const SvgIcon = languageMap[language];

    return <SvgIcon width={width} height={height} />;
};

export default LanguageIcon;
