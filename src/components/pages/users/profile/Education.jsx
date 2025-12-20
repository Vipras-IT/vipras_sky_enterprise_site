import educationData from 'data/educations';
import FalconCardHeader from 'components/common/FalconCardHeader';
import { Card } from 'react-bootstrap';
import EducationItem from '../EducationItem';

const Education = () => {
  return (
    <Card className="mb-3 Alignheader">
      <FalconCardHeader
        className="text-white bg-danger"
        title="Experience"
        light
      />
      <Card.Body className="fs--1">
        {educationData.map((item, index) => (
          <EducationItem
            key={item.id}
            details={item}
            isLast={index === educationData.length - 1}
          />
        ))}
      </Card.Body>
    </Card>
  );
};

export default Education;
