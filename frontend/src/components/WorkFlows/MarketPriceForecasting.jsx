
import { Link } from 'react-router-dom';
import Loading from '../../Utils/Loading';
import { DigikarshakanAPIs } from '../../utils/DigikarshakanAPIs';
import { ArrowDown, ArrowUp } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { notifyError } from '../../Utils/Toasts';

const MarketPriceForecasting = () => {
  const [apiResponse, setApiResponse] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [recordsPerPage, setRecordsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'Commodity', direction: 'asc' });
  

const fetchData = async (latitude, longitude) => {
  try {
    const response = await DigikarshakanAPIs.marketPriceForecasting(latitude, longitude);
    if (response.status === 200) {
      setApiResponse(response.data);
      // Defensive: check for nested records array
      const records = Array.isArray(response.data?.data?.records)
        ? response.data.data.records
        : [];
      setFilteredData(records);
      setLoading(false);
    }
  } catch (error) {
    console.error(error);
    notifyError("Error Fetching Data");
  }
};

useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      fetchData(latitude, longitude);
    },
    (err) => {
      console.error(err);
      notifyError("Location permission denied or unavailable");
      setLoading(false);
    }
  );
}, []);


  const handleSort = (column) => {
    let direction = 'asc';
    if (sortConfig.key === column && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: column, direction });
  };

 const sortedData = [...filteredData].sort((a, b) => {
  const valA = a[sortConfig.key];
  const valB = b[sortConfig.key];

  if (valA === undefined || valB === undefined) return 0;

  // If it's a number (like prices), compare numerically
  if (!isNaN(valA) && !isNaN(valB)) {
    return sortConfig.direction === 'asc'
      ? Number(valA) - Number(valB)
      : Number(valB) - Number(valA);
  }

  // Otherwise do string comparison
  return sortConfig.direction === 'asc'
    ? String(valA).localeCompare(String(valB))
    : String(valB).localeCompare(String(valA));
});


  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query) {
      const lowercasedQuery = query.toLowerCase();
      const filtered = apiResponse.data.records.filter(
        (item) =>
          item.Commodity.toLowerCase().includes(lowercasedQuery) ||
          item.Variety.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(apiResponse.data.records);
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedData.slice(indexOfFirstRecord, indexOfLastRecord);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRecordsPerPageChange = (event) => {
    setRecordsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000).toLocaleString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
    return date.replace('am', 'AM').replace('pm', 'PM');
  };
  const currentTimestamp = Math.floor(Date.now() / 1000);
  return (
    <div className="max-w-7xl mx-auto px-6">
      {loading && <Loading />}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center mt-10 pt-5 tracking-wide" data-aos="fade-up" data-aos-delay="300">
        Market Price Fore
        <span className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-transparent bg-clip-text">
          casting
        </span>
      </h2>
      <p className="text-center text-neutral-600 dark:text-neutral-500 font-normal mt-3" data-aos="fade-up" data-aos-delay="300">
        Predicts future crop market prices, helping you decide when to sell <br />
        for maximum profit based on trends
      </p>
      <p className="text-center text-neutral-600 dark:text-neutral-500 font-normal mt-3" data-aos="fade-up" data-aos-delay="300">
        Resource: <Link to="https://agmarknet.gov.in/" target="_blank" className="text-custom-green">AGMARKNET</Link>
      </p>
      <p className="text-center text-neutral-600 dark:text-neutral-500 font-normal mt-3" data-aos="fade-up" data-aos-delay="300">
        {formatDate(currentTimestamp)}
      </p>
      <div className="flex items-center space-x-2 m-10" data-aos="zoom-in" data-aos-delay="300">
        <input
          type="text"
          placeholder="Search by Commodity or Variety"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full sm:6/12 md:w-10/12 lg:w-8/12 rounded-lg shadow-lg p-3 h-12 bg-neutral-100 dark:bg-neutral-900"
        />
        
        <select
          value={recordsPerPage}
          onChange={handleRecordsPerPageChange}
          className="w-full sm:6/12 md:w-2/12 lg:w-4/12 rounded-lg shadow-lg p-3 h-12 bg-neutral-100 dark:bg-neutral-900"
        >
          <option value={10}>10 Records</option>
          <option value={20}>20 Records</option>
          <option value={50}>50 Records</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto" data-aos="zoom-in" data-aos-delay="300">
          <thead>
            <tr className="text-neutral-500 dark:text-neutral-200">
              <th
                onClick={() => handleSort('Commodity')}
                className="cursor-pointer px-4 py-2 text-left border border-neutral-800"
              >
                <span className="ml-2 flex items-center">Commodity &nbsp;
                  <ArrowUp
                    className={`w-4 h-4 ${sortConfig.key === 'Commodity' && sortConfig.direction === 'asc' ? 'text-green-500' : 'text-neutral-500'}`}
                  />
                  <ArrowDown
                    className={`w-4 h-4 ${sortConfig.key === 'Commodity' && sortConfig.direction === 'desc' ? 'text-red-500' : 'text-neutral-500'}`}
                  />
                </span>
              </th>
              <th
                onClick={() => handleSort('Variety')}
                className="cursor-pointer px-4 py-2 text-left border border-neutral-800"
              >
                <span className="ml-2 flex items-center">Variety &nbsp;
                  <ArrowUp
                    className={`w-4 h-4 ${sortConfig.key === 'Variety' && sortConfig.direction === 'asc' ? 'text-green-500' : 'text-neutral-500'}`}
                  />
                  <ArrowDown
                    className={`w-4 h-4 ${sortConfig.key === 'Variety' && sortConfig.direction === 'desc' ? 'text-red-500' : 'text-neutral-500'}`}
                  />
                </span>
              </th>
              <th
                onClick={() => handleSort('Max_Price')}
                className="cursor-pointer px-4 py-2 text-left border border-neutral-800"
              >
                <span className="ml-2 flex items-center">Max Price &nbsp;
                  <ArrowUp
                    className={`w-4 h-4 ${sortConfig.key === 'Max_Price' && sortConfig.direction === 'asc' ? 'text-green-500' : 'text-neutral-500'}`}
                  />
                  <ArrowDown
                    className={`w-4 h-4 ${sortConfig.key === 'Max_Price' && sortConfig.direction === 'desc' ? 'text-red-500' : 'text-neutral-500'}`}
                  />
                </span>
              </th>
              <th
                onClick={() => handleSort('Min_Price')}
                className="cursor-pointer px-4 py-2 text-left border border-neutral-800"
              >
                <span className="ml-2 flex items-center">Min Price &nbsp;
                  <ArrowUp
                    className={`w-4 h-4 ${sortConfig.key === 'Min_Price' && sortConfig.direction === 'asc' ? 'text-green-500' : 'text-neutral-500'}`}
                  />
                  <ArrowDown
                    className={`w-4 h-4 ${sortConfig.key === 'Min_Price' && sortConfig.direction === 'desc' ? 'text-red-500' : 'text-neutral-500'}`}
                  />
                </span>
              </th>
               <th
                onClick={() => handleSort('Market')}
                className="cursor-pointer px-4 py-2 text-left border border-neutral-800"
              >
                <span className="ml-2 flex items-center">Market &nbsp;
                  <ArrowUp
                    className={`w-4 h-4 ${sortConfig.key === 'Market' && sortConfig.direction === 'asc' ? 'text-green-500' : 'text-neutral-500'}`}
                  />
                  <ArrowDown
                    className={`w-4 h-4 ${sortConfig.key === 'Market' && sortConfig.direction === 'desc' ? 'text-red-500' : 'text-neutral-500'}`}
                  />
                </span>
              </th>
              <th
                onClick={() => handleSort('District')}
                className="cursor-pointer px-4 py-2 text-left border border-neutral-800"
              >
                <span className="ml-2 flex items-center">District &nbsp;
                  <ArrowUp
                    className={`w-4 h-4 ${sortConfig.key === 'District' && sortConfig.direction === 'asc' ? 'text-green-500' : 'text-neutral-500'}`}
                  />
                  <ArrowDown
                    className={`w-4 h-4 ${sortConfig.key === 'District' && sortConfig.direction === 'desc' ? 'text-red-500' : 'text-neutral-500'}`}
                  />
                </span>
              </th>
              <th
                onClick={() => handleSort('State')}
                className="cursor-pointer px-4 py-2 text-left border border-neutral-800"
              >
                <span className="ml-2 flex items-center">State &nbsp;
                  <ArrowUp
                    className={`w-4 h-4 ${sortConfig.key === 'State' && sortConfig.direction === 'asc' ? 'text-green-500' : 'text-neutral-500'}`}
                  />
                  <ArrowDown
                    className={`w-4 h-4 ${sortConfig.key === 'State' && sortConfig.direction === 'desc' ? 'text-red-500' : 'text-neutral-500'}`}
                  />
                </span>
              </th>
              
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((row, index) => (
                <tr key={index} className="text-neutral-500">
                  <td className="px-4 py-2 border border-neutral-800">{row.Commodity}</td>
                  <td className="px-4 py-2 border border-neutral-800">{row.Variety}</td>
                  <td className="px-4 py-2 border border-neutral-800">{row.Max_Price}</td>
                  <td className="px-4 py-2 border border-neutral-800">{row.Min_Price}</td>
                   <td className="px-4 py-2 border border-neutral-800">{row.Market}</td>
                  <td className="px-4 py-2 border border-neutral-800">{row.District}</td>
                  <td className="px-4 py-2 border border-neutral-800">{row.State}</td>

                </tr>
              ))
            ) : (
              <tr className="text-neutral-500">
                <td colSpan="4" className="px-4 py-2 border border-neutral-800 text-center">
                  No data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center items-center space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-900 ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          Prev
        </button>

        <span>
          Page {currentPage} of {Math.ceil(filteredData.length / recordsPerPage)}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredData.length / recordsPerPage)}
          className={`px-4 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-900 ${currentPage === Math.ceil(filteredData.length / recordsPerPage) ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MarketPriceForecasting;

