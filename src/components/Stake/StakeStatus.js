import React from 'react'

export default function StakeStatus(props) {
  if (!props.currentDelegate) {
    return (
      <div>
        <h4>Your status</h4>
        <h6 className="full-width-align-left">
          Cannot get your current status
        </h6>
      </div>
    );
  }
  return (
    <div>
      <h4>Your status</h4>
      <h6 className="full-width-align-left">
        Your are staking for {props.currentDelegate || "None"}
      </h6>
    </div>
  );
}