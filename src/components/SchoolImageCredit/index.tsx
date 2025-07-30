import Well from "@/components/Well";
import type { SchoolDetail } from "@/types";

export default function SchoolImageCredit(props: {
  school: SchoolDetail;
}) {
  const {
    school,
  } = props;

  if (!school.image || !school.imageCredit) {
    return null;
  }

  return (
    <Well section width="text">
      <div>
        Photo credit:
        {" "}
        <span dangerouslySetInnerHTML={{ __html: school.imageCredit }} />
      </div>
    </Well>
  );
}
