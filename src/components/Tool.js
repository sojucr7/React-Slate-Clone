import { useEffect, useState } from "react";

export default function Tool({ cmd, arg, icon,setActiveCmd,activeCmd }) {
  const [active, setActive] = useState(null);

  const handleMouseDown = (evt) => {
    evt.preventDefault(); // Avoids loosing focus from the editable area
    document.execCommand(cmd, false, arg); // Send the command to the browser
    if(activeCmd==cmd){
      setActiveCmd(null);
      return
    }
    setActiveCmd(cmd)
  }  
  return (
    <span className={`toolbar-icon ${(cmd==activeCmd) ? 'active':''}`} onMouseDown={handleMouseDown}>{icon}</span>
  );
}