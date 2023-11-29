import Banner from "../organisms/banner/banner";
import FooterBanner from "../organisms/footerBanner/footerBanner";
import Navigationbar from "../organisms/navigationbar/navigatiobar";
import NewsLetter from "../organisms/newsletter/newsLetter";

type Props = {};

export default function Home({}: Props) {
  return (
    <>
      <Banner />

      <FooterBanner />
      <NewsLetter />
    </>
  );
}
