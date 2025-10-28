import CinemaDetallWidget from "@/components/Widgets/CinemaDetallWidget";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const CinemaDetail = () => {
  return (
    <div>
      <CinemaDetallWidget />
    </div>
  );
};

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default CinemaDetail;
