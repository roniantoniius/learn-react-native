import { Card, Col } from "react-bootstrap";
import styles from "../styles/NoteList.module.css";

type GuideStepProps = {
  stepNumber: number;
  imageSrc: string;
  description: string;
};

export const GuideStep: React.FC<GuideStepProps> = ({ stepNumber, imageSrc, description }) => {
  return (
    <Col xs={12} md={4}>
      <Card className={`text-center ${styles.subCard}`}>
        <Card.Body>
          <img src={imageSrc} alt={`Step ${stepNumber}`} className={styles.guideImage} />
          <p className="custom-medium mt-2">{`${stepNumber}. ${description}`}</p>
        </Card.Body>
      </Card>
    </Col>
  );
};