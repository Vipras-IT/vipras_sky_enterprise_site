import { Row, Col, Card } from 'react-bootstrap';
import WizardInput from 'components/wizard/WizardInput';
import IconButton from 'components/common/IconButton';

const SiteAssest = () => {
  return (
    <>
      <Card>
        <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
          <div className="position-relative z-index-1 light">
            <h5 className="mb-0 text-white">Site Assest Creation</h5>
          </div>
        </Card.Header>
        <Card.Body className="fw-normal px-md-6 py-4">
          <Row className="g-2 mb-3">
            <WizardInput
              label="Tower/Block"
              name="blockno"
              errors={''}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{}}
            />
            <WizardInput
              label="Transformer"
              name="transformer"
              errors={''}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{}}
            />
          </Row>
          <Row className="g-2 mb-3">
            <WizardInput
              label="EB Room"
              name="ebroom"
              errors={''}
              setValue={''}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{}}
            />
            <WizardInput
              label="EB Room"
              name="ebroom"
              errors={''}
              setValue={''}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{}}
            />
          </Row>
          <Row className="g-2 mb-3">
            <WizardInput
              label="Panel Board"
              name="panelboard"
              errors={''}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{}}
            />

            <WizardInput
              label="FMS Office"
              name="fmsoffice"
              errors={''}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{}}
            />
          </Row>
          <Row className="g-2 mb-3">
            <WizardInput
              label="Bore"
              name="bore"
              errors={''}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{}}
            />

            <WizardInput
              label="Sump"
              name="sump"
              errors={''}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{}}
            />
          </Row>
          <Row className="g-2 mb-3">
            <WizardInput
              label="OH"
              name="oh"
              errors={''}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{}}
            />

            <WizardInput
              label="Manual Pneumatic Pumb"
              name="pnepumb"
              errors={''}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{}}
            />
          </Row>
          <Row className="g-2 mb-3">
            <WizardInput
              label="WTP Plant"
              name="wrpplant"
              errors={''}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{}}
            />

            <WizardInput
              label="STP Plant"
              name="stpplant"
              errors={''}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{}}
            />
          </Row>
          <Row className="g-2 mb-3">
            <WizardInput
              label="Garden"
              name="garden"
              errors={''}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{}}
            />
            <WizardInput
              label="Garbage"
              name="garbage"
              errors={''}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{}}
            />
          </Row>

          <Row className="g-2 mb-3">
            <WizardInput
              label="Basement"
              name="basement"
              errors={''}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{}}
            />
            <WizardInput
              label="Date"
              type="date"
              name="date"
              errors={''}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{}}
            />
          </Row>
        </Card.Body>
        <Card.Footer>
          <IconButton
            variant="primary"
            className="ms-auto px-6 alignbutton"
            type="submit"
            iconAlign="right"
            transform="down-1 shrink-4"
          >
            Save
          </IconButton>
        </Card.Footer>
      </Card>
    </>
  );
};

export default SiteAssest;
