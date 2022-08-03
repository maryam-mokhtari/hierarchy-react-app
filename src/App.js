import { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [hierarchies, setHierarchies] = useState({ myRoot: {} });

  useEffect(() => {
    const mockData = {
      myRoot: {
        "package.json": {},
        src: {
          "App.js": {},
          "logo.svg": {},
          css: {
            "Styles.css": {},
          },
        },
      },
    };
    setHierarchies(mockData);
  }, []);

  const createNewNode = (data, keys, newKey, index = 0) => {
    const key = keys[index];

    const result = {
      ...data,
      [key]: {
        ...data[key],
        ...(index === keys.length - 1
          ? { [newKey]: {} }
          : createNewNode(data[key], keys, newKey, index + 1)),
      },
    };
    return result;
  };

  const removeNode = (data, keys, index = 0) => {
    const key = keys[index];

    const result = {
      ...data,
      [key]: {
        ...(index === keys.length - 1
          ? null
          : removeNode(data[key], keys, index + 1)),
      },
    };
    return result;
  };

  const addFolder = (e, newKey) => {
    e.preventDefault();
    e.stopPropagation();
    let value = prompt();
    const keys = newKey.split("-");
    setHierarchies(createNewNode(hierarchies, keys, value));
  };

  const removeFolder = (e, newKey) => {
    e.preventDefault();
    e.stopPropagation();
    const keys = newKey.split("-");
    setHierarchies(removeNode(hierarchies, keys));
  };

  const Node = ({ data, keys, nodeKey }) => {
    const newKeys = keys ? `${keys}-${nodeKey}` : nodeKey;
    const isFolder = !nodeKey.includes(".");
    const [isShown, setIsShown] = useState(true);

    const toggle = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsShown((isShown) => !isShown);
    };

    return (
      <li onClick={(e) => toggle(e, nodeKey)}>
        <div
          className={`row ${isFolder ? "folder" : "file"} ${
            isShown ? "expanded" : "collapsed"
          }`}
        >
          {nodeKey}
          {isFolder && (
            <>
              <div
                id={newKeys}
                className="plus"
                onClick={(e) => addFolder(e, newKeys)}
              >
                +
              </div>
              <div
                id={newKeys}
                className="minus"
                onClick={(e) => removeFolder(e, newKeys)}
              >
                -
              </div>
            </>
          )}
        </div>
        {typeof data[nodeKey] === "object" && isShown && (
          <ul id={nodeKey}>
            {Object.keys(data[nodeKey]).map((newkey) =>
              createNodes(data[nodeKey], newkey, newKeys)
            )}
          </ul>
        )}
      </li>
    );
  };

  const createNodes = (data, nodeKey, keys) => {
    return (
      nodeKey &&
      data && <Node data={data} keys={keys} key={nodeKey} nodeKey={nodeKey} />
    );
  };

  return (
    <div>
      <ul>
        {hierarchies &&
          Object.keys(hierarchies).map((key) => createNodes(hierarchies, key))}
      </ul>
    </div>
  );
};

export default App;
