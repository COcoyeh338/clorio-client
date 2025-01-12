import Avatar from "../../../tools/avatar/avatar";
import Button from "../../UI/Button";
import StakeTableValue from "./StakeTableValue";
import { IValidatorData } from "./ValidatorDataTypes";

interface IProps {
  index: number;
  element: IValidatorData;
  toggleModal: (element: IValidatorData) => void;
  isDelegating?: boolean;
  loading?: boolean;
}

const StakeTableRow = ({
  element,
  index,
  toggleModal,
  isDelegating,
  loading,
}: IProps) => {
  let supportTooltip = "";
  let boostedClassName = "";
  if (element.priority === 1) {
    supportTooltip =
      "~Clorio is built by Carbonara. <br>Earn rewards and support Clorio <br>by delegating to Carbonara ❤️";
    boostedClassName = "is-boosted";
  }

  const delegateButton = () => {
    const buttonHandler = !isDelegating
      ? () => toggleModal(element)
      : () => null;
    const buttonColor = loading
      ? "whiteButton__fullMono no-padding"
      : isDelegating
      ? "lightGreenButton__fullMono yellowButton__fullMono"
      : "yellowButton__fullMono";
    const text = isDelegating ? "Delegating" : "Delegate";
    return (
      <Button
        className={`${buttonColor} button-small-padding`}
        text={text}
        loading={loading}
        disableAnimation={isDelegating}
        onClick={buttonHandler}
      />
    );
  };

  return (
    <tr
      key={index}
      className={`stake-table-row ${boostedClassName}`}
      data-tip={supportTooltip}
    >
      <StakeTableValue
        avatar={
          <div className="walletImageContainer small-image inline-element">
            {element.image ? (
              <img className="small-walletImage" src={element.image} />
            ) : (
              <Avatar
                className="small-walletImage"
                address={element.publicKey}
                size="30"
              />
            )}
          </div>
        }
        header="Validator"
        text={element.name}
        className="table-element"
      />
      <StakeTableValue
        className="table-element"
        header={"Fee"}
        text={`${element.fee}%`}
      />
      <StakeTableValue
        className="table-element"
        header={"Staked"}
        text={`${parseInt(element?.stakedSum || "0")} Mina`}
      />
      <StakeTableValue
        className="table-element"
        header={"info"}
        text={"Website"}
        website={element.website}
      />
      <td className="table-element stake-table-button">{delegateButton()}</td>
    </tr>
  );
};

export default StakeTableRow;
