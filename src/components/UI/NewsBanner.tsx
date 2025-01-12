import { Row, Col } from "react-bootstrap";
import { INewsData } from "../../types/NewsData";
import { isEmptyObject } from "../../tools/utils";
import Button from "./Button";

const NewsBanner = (props: INewsData) => {
  const { title, subtitle, link, cta, cta_color, visible } = props;
  /**
   * Returns the style based on cta_color prop
   * @returns string Classname
   */
  const buttonStyle = () => {
    switch (cta_color) {
      case "success":
        return "lightGreenButton__outlineMono ";
      case "warning":
        return "yellowButton__outlineMono ";
      default:
        return "lightGreenButton__outlineMono ";
    }
  };

  return !isEmptyObject(props) && visible ? (
    <div className="block-container">
      <Row>
        <Col md={8} lg={8} xl={9}>
          <h4>{title}</h4>
          <p>{subtitle}</p>
        </Col>
        {cta && link && (
          <Col className="align-end ml-auto pt-20p">
            {link ? (
              <a href={link} target="_blank" rel="noreferrer">
                <Button
                  className={`${buttonStyle()} mx-auto`}
                  text={cta || "Learn more"}
                />
              </a>
            ) : (
              <Button
                className={`${buttonStyle()} mx-auto`}
                text={cta || "Learn more"}
              />
            )}
          </Col>
        )}
      </Row>
    </div>
  ) : (
    <></>
  );
};

export default NewsBanner;
