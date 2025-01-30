import "./App.css"; // updated CSS file
import Locker from "./components/Locker/Locker";
import { useState, useEffect, Fragment, useMemo } from "react";

// Utility function to get stored value from local storage
const getStoredValue = (key, defaultValue) => {
  const savedValue = localStorage.getItem(key);
  return savedValue ? JSON.parse(savedValue) : defaultValue;
};

const LockerManagementSystem = () => {
  const [activeLocker, setActiveLocker] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);
  const [rowCount, setRowCount] = useState(() => getStoredValue("rowCount", 0));
  const [columnCount, setColumnCount] = useState(() => getStoredValue("columnCount", 0));
  const [lockerList, setLockerList] = useState(() => getStoredValue("lockerList", []));
  const [inputRowCount, setInputRowCount] = useState(() => getStoredValue("rowCount", 0));
  const [inputColumnCount, setInputColumnCount] = useState(() => getStoredValue("columnCount", 0));

  useEffect(() => {
    const savedLockers = localStorage.getItem("lockerList");
    if (savedLockers) {
      setLockerList(JSON.parse(savedLockers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lockerList", JSON.stringify(lockerList));
  }, [lockerList]);

  useEffect(() => {
    localStorage.setItem("rowCount", JSON.stringify(rowCount));
    localStorage.setItem("columnCount", JSON.stringify(columnCount));
  }, [rowCount, columnCount]);

  const generateLockers = () => {
    setRowCount(inputRowCount);
    setColumnCount(inputColumnCount);
    const newLockerList = [];
    for (let r = 0; r < inputRowCount; r++) {
      for (let c = 0; c < inputColumnCount; c++) {
        newLockerList.push({
          id: `${r}-${c}`,
          row: r,
          col: c,
          status: "closed",
        });
      }
    }
    setLockerList(newLockerList);
  };

  const updateLockerStatus = (id, newStatus) => {
    setLockerList(
      lockerList.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
    setActiveLocker(null);
  };

  const handleColumnAction = (action) => {
    if (activeColumn === null) return;

    const updatedLockers = lockerList.map((item) => {
      if (item.col === activeColumn) {
        return { ...item, status: action };
      }
      return item;
    });
    setLockerList(updatedLockers);
  };

  const columnButtons = useMemo(() => {
    return Array.from({ length: columnCount }).map((_, colIndex) => (
      <button
        className={`column-button ${colIndex === activeColumn ? "selected" : ""}`}
        key={colIndex}
        onClick={() => setActiveColumn(colIndex)}
      >
        Col {colIndex + 1}
      </button>
    ));
  }, [columnCount, activeColumn]);

  const lockerComponents = useMemo(() => {
    return lockerList.map((locker) => (
      <Locker
        key={locker.id}
        status={locker.status}
        onClick={() => setActiveLocker(locker.id)}
      />
    ));
  }, [lockerList]);

  return (
    <Fragment>
      <div className="locker_main_wrap"></div>
      <div className="locker_main">
        <div className="header">
          <h1>Locker Management System</h1>
          <div className="input-group">
            <input
              type="number"
              placeholder="Rows"
              value={inputRowCount}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value > 0) {
                  setInputRowCount(value);
                }
              }}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Columns"
              value={inputColumnCount}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value > 0) {
                  setInputColumnCount(value);
                }
              }}
              className="input-field"
            />
            <button onClick={generateLockers} className="generate-button">
              Generate Lockers
            </button>
          </div>
        </div>
        <div className="locker-management-system">
          {lockerList.length > 0 ? (
            <>
              <div className="column-actions">
                <button
                  onClick={() => handleColumnAction("open")}
                  className="action-button"
                >
                  Open All in Column
                </button>
                <button
                  onClick={() => handleColumnAction("closed")}
                  className="action-button"
                >
                  Close All in Column
                </button>
                <button
                  onClick={() => handleColumnAction("reserved")}
                  className="action-button"
                >
                  Reserve All in Column
                </button>
              </div>
              <div className="output_title_of_grid">
                Your Locker having {rowCount} Rows and {columnCount} Columns
              </div>
            </>
          ) : null}
          <div
            className="grid-container"
            style={{
              gridTemplateColumns: `repeat(${columnCount}, 80px)`,
            }}
          >
            {columnButtons}
            {lockerComponents}
          </div>

          {activeLocker && (
            <div className="modal">
              <h3>Locker Actions</h3>
              <div className="modal_btns">
                <button
                  onClick={() => updateLockerStatus(activeLocker, "open")}
                  className="modal-button"
                >
                  Open
                </button>
                <button
                  onClick={() => updateLockerStatus(activeLocker, "closed")}
                  className="modal-button"
                >
                  Close
                </button>
                <button
                  onClick={() => updateLockerStatus(activeLocker, "reserved")}
                  className="modal-button"
                >
                  Reserve
                </button>
                <button
                  onClick={() => setActiveLocker(null)}
                  className="modal-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        <p id="created_by">Developed By Vishal Kumar</p>
      </div>
    </Fragment>
  );
};

export default LockerManagementSystem;
