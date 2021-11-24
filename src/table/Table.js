import { useEffect, useState } from 'react';
import { STATIC_DATA } from '../dataset';
import { ReactComponent as ArrowDown } from './../assets/arrow-down.svg';
import { ReactComponent as Incomplete } from './../assets/incomplete.svg';
import { ReactComponent as Complete } from './../assets/complete.svg';
import { ReactComponent as Error } from './../assets/error.svg';

const getTableColumns = (data) => {
  if (
    data &&
    data.length > 0 &&
    Object.keys(data[0]) &&
    Object.keys(data[0]).length > 0
  ) {
    return Object.keys(data[0]);
  }
};

const getStatusFilterOptions = (data) => {
  return data.reduce((agg, curr) => {
    if (!agg.includes(curr.status)) {
      agg.push(curr.status);
    }
    return agg;
  }, []);
};

const HandleStatusIcon = ({ status }) => {
  console.log('stats:', status);
  const iconClass = 'w-6 m-3';
  switch (status) {
    case 'COMPLETE':
      return <Complete className={iconClass}></Complete>;

    case 'INCOMPLETE':
      return <Incomplete className={iconClass}></Incomplete>;

    default:
      return <Error className={iconClass}></Error>;
  }
};

export const Table = () => {
  const [columns, setColumns] = useState();
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [statusFilterOptions, setStatusFilterOptions] = useState();
  const [statusFilterOptionsValues, setStatusFilterOptionsValues] = useState(
    []
  );
  const [filteredData, setFilteredData] = useState();

  useEffect(() => {
    setFilteredData([...STATIC_DATA]);
    setColumns(getTableColumns(STATIC_DATA));
    setStatusFilterOptions(getStatusFilterOptions(STATIC_DATA));
  }, []);

  const handleStatusDropdown = () => {
    setShowStatusFilter(!showStatusFilter);
  };

  const filterData = (e) => {
    const filterName = e.target.name;
    const filterValue = e.target.checked;
    let newFilterValues = statusFilterOptionsValues;
    if (filterValue) {
      newFilterValues.push(filterName);
    } else {
      newFilterValues = statusFilterOptionsValues.filter(
        (item) => item !== filterName
      );
    }
    let filteredData;
    if (newFilterValues.length > 0) {
      filteredData = STATIC_DATA.filter((item) =>
        newFilterValues.includes(item.status)
      );
    } else {
      filteredData = STATIC_DATA;
    }

    setStatusFilterOptionsValues(newFilterValues);
    setFilteredData(filteredData);
  };

  return (
    <div className="p-4  w-min shadow-lg bg-white rounded-md">
      {columns && (
        <table className=" table-auto ">
          <thead>
            <tr>
              {columns.map((header, index) => (
                <th className="py-2 px-8 capitalize" key={index}>
                  <div className="flex justify-center items-center relative">
                    <span>{header}</span>
                    {header === 'status' && (
                      <>
                        <ArrowDown
                          className="w-4 h-4 ml-1 mt-1 cursor-pointer hover:bg-gray-200 "
                          onClick={handleStatusDropdown}
                        />

                        {showStatusFilter && statusFilterOptions && (
                          <div className="flex flex-col  p-3 rounded-md absolute bottom-6 bg-white shadow-lg">
                            {statusFilterOptions.map((filter, index) => (
                              <div className="flex items-center " key={index}>
                                <input
                                  type="checkbox"
                                  id={filter}
                                  name={filter}
                                  onChange={filterData}
                                />
                                <span className="ml-2">{filter}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData &&
              filteredData.map((row, index) => (
                <tr className="p-4 m-4">
                  {columns.map((col, index) => (
                    <td key={index}>
                      {col === 'status' ? (
                        <div className="flex justify-center">
                          <HandleStatusIcon status={row[col]} />
                        </div>
                      ) : (
                        row[col]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
