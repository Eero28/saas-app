import React from 'react';
import "../styling/expandablebox.css"

interface HomeProps {
    buttonState: boolean;
    setButtonState: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
}

const ExpandableBox = ({ buttonState, setButtonState, children }: HomeProps) => {
    const handleButton = () => {
        setButtonState(!buttonState)
    }
    return (
        <div className='container'>
            <button className='expandableboxButton' onClick={handleButton}>
                {buttonState ? "+" : "-"}
            </button>
            <div className={buttonState ? "box-active" : "box-inactive"}>
                {children}
            </div>
        </div>
    );
};

export default ExpandableBox;
