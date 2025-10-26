import CinemaDetallWidget from "@/components/Widgets/CinemaDetallWidget";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const CinemaDetail = () => {
  return (
    <div>
      <CinemaDetallWidget />
    </div>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "cinema"])),
    },
  };
}

export default CinemaDetail;
