import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Home, Settings, BarChart2, Edit, Plus, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import _ from 'lodash';


// Main App Component
export default function Component() {
  // State definitions
  const [activeTab, setActiveTab] = useState('dashboard');
  const [db, setDb] = useState(null);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [timeEntries, setTimeEntries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  });
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
    type: 'work',
    notes: ''
  });
  const [editingEntry, setEditingEntry] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Define helper functions before they're used
  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Track hours calculations
  const calculateHours = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const totalStartMinutes = startHours * 60 + startMinutes;
    const totalEndMinutes = endHours * 60 + endMinutes;
    
    return (totalEndMinutes - totalStartMinutes) / 60;
  };
  
  // Export data function - using direct download approach
  const exportData = () => {
    try {
      // Prepare the data to export
      const dataToExport = {
        users,
        categories,
        timeEntries,
        version: "1.0.0" // Adding version for future compatibility
      };
      
      // Convert to JSON string
      const jsonString = JSON.stringify(dataToExport, null, 2);
      
      // Create a data URL (this avoids storage API usage)
      const dataUrl = `data:application/json;charset=utf-8,${encodeURIComponent(jsonString)}`;
      
      // Create and trigger a download link
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = `timetrack_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(downloadLink);
      }, 100);
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting data: ' + error.message);
    }
  };
  
  // Import data function
  const handleImportFile = (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          
          // Validate the data structure
          if (!importedData.users || !importedData.categories || !importedData.timeEntries) {
            throw new Error('Invalid data format');
          }
          
          // Confirm before replacing data
          if (window.confirm('This will replace your current data. Continue?')) {
            // Set the imported data
            setUsers(importedData.users);
            setCategories(importedData.categories);
            setTimeEntries(importedData.timeEntries);
            
            // Set default user if available
            if (importedData.users.length > 0) {
              setUser(importedData.users[0]);
            }
            
            alert('Data imported successfully!');
          }
        } catch (error) {
          alert('Error parsing imported data: ' + error.message);
          console.error('Import parsing error:', error);
        }
      };
      
      reader.onerror = () => {
        alert('Error reading file');
      };
      
      reader.readAsText(file);
      
      // Reset the file input
      event.target.value = null;
    } catch (error) {
      alert('Error importing data: ' + error.message);
      console.error('Import error:', error);
    }
  };

  // Function to generate sample time entries
  const generateSampleEntries = (users, categories) => {
    const entries = [];
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 60); // Go back 60 days
    
    // Generate entries for each day
    for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
      // Skip weekends
      if (d.getDay() === 0 || d.getDay() === 6) continue;
      
      // Format date as YYYY-MM-DD string without time component to avoid timezone issues
      const date = d.toISOString().split('T')[0];
      
      // For each user
      users.forEach(user => {
        // Randomly determine if this is a special day (sick, holiday, remote)
        const rand = Math.random();
        let type;
        
        if (rand < 0.05) {
          type = 'sick';
        } else if (rand < 0.15) {
          type = 'holiday';
        } else if (rand < 0.35) {
          type = 'remote';
        } else {
          type = 'work';
        }
        
        // Find the category that matches this type
        const category = categories.find(c => c.type === type);
        
        // Create time entry - full day 9-5 for simplicity
        entries.push({
          id: entries.length + 1,
          userId: user.id,
          date,
          startTime: '09:00',
          endTime: '17:00',
          category: category.id,
          type: type,
          notes: `Sample ${type} entry`
        });
        
        // Occasionally add an overtime entry
        if (Math.random() < 0.1 && type === 'work') {
          const overtimeCategory = categories.find(c => c.type === 'overtime');
          entries.push({
            id: entries.length + 1,
            userId: user.id,
            date,
            startTime: '17:00',
            endTime: '19:00',
            category: overtimeCategory.id,
            type: 'overtime',
            notes: 'Sample overtime entry'
          });
        }
      });
    }
    
    return entries;
  };

  // Initialize the database
  useEffect(() => {
    const initDatabase = async () => {
      try {
        // Simulating the IndexedDB creation
        console.log("Initializing database...");
        
        // Create sample data
        const sampleUsers = [
          { id: 1, name: 'John Doe', email: 'john@example.com', holidayAllocation: 25 * 8, sickLeaveAllocation: 10 * 8 },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', holidayAllocation: 25 * 8, sickLeaveAllocation: 10 * 8 }
        ];
        
        const sampleCategories = [
          { id: 1, name: 'Regular Work', color: '#4CAF50', isDefault: true, shortcut: 'w', type: 'work' },
          { id: 2, name: 'Remote Work', color: '#2196F3', isDefault: false, shortcut: 'r', type: 'remote' },
          { id: 3, name: 'Sick Leave', color: '#F44336', isDefault: false, shortcut: 's', type: 'sick' },
          { id: 4, name: 'Holiday', color: '#FF9800', isDefault: false, shortcut: 'h', type: 'holiday' },
          { id: 5, name: 'Overtime', color: '#9C27B0', isDefault: false, shortcut: 'o', type: 'overtime' }
        ];
        
        // Create fake time entries for the past 30 days - ensure dates are in YYYY-MM-DD format
        const sampleTimeEntries = generateSampleEntries(sampleUsers, sampleCategories);
        
        setUsers(sampleUsers);
        setCategories(sampleCategories);
        setTimeEntries(sampleTimeEntries);
        setUser(sampleUsers[0]); // Set default user
        setDb(true);
        setLoading(false);
      } catch (error) {
        console.error("Database initialization error:", error);
        setLoading(false);
      }
    };

    initDatabase();
  }, []);

  // Filter entries by user and date range
  const filteredEntries = timeEntries.filter(entry => {
    return entry.userId === user?.id && 
           new Date(entry.date) >= dateRange.start && 
           new Date(entry.date) <= dateRange.end;
  });

  // Calculate statistics
  const stats = React.useMemo(() => {
    if (!user) return {};
    
    const userEntries = timeEntries.filter(entry => entry.userId === user.id);
    const thisYear = new Date().getFullYear();
    const thisYearEntries = userEntries.filter(entry => new Date(entry.date).getFullYear() === thisYear);
    
    const holidayEntries = thisYearEntries.filter(entry => entry.type === 'holiday');
    const sickEntries = thisYearEntries.filter(entry => entry.type === 'sick');
    const remoteEntries = thisYearEntries.filter(entry => entry.type === 'remote');
    
    const totalHolidayHours = holidayEntries.reduce((sum, entry) => 
      sum + calculateHours(entry.startTime, entry.endTime), 0);
    
    const totalSickHours = sickEntries.reduce((sum, entry) => 
      sum + calculateHours(entry.startTime, entry.endTime), 0);
    
    const totalRemoteHours = remoteEntries.reduce((sum, entry) => 
      sum + calculateHours(entry.startTime, entry.endTime), 0);
    
    const remainingHolidayHours = user.holidayAllocation - totalHolidayHours;
    
    return {
      totalHolidayHours,
      totalSickHours,
      totalRemoteHours,
      remainingHolidayHours
    };
  }, [timeEntries, user]);

  // Data for the chart
  const chartData = React.useMemo(() => {
    if (!filteredEntries.length) return { labels: [], datasets: [] };
    
    // Group entries by date
    const groupedByDate = _.groupBy(filteredEntries, 'date');
    
    // Calculate hours for each day
    const data = Object.entries(groupedByDate).map(([date, entries]) => {
      const totalHours = entries.reduce((sum, entry) => 
        sum + calculateHours(entry.startTime, entry.endTime), 0);
      
      return {
        date,
        hours: totalHours
      };
    });
    
    // Sort by date
    const sortedData = _.sortBy(data, 'date');
    
    return {
      labels: sortedData.map(d => formatDate(d.date)),
      datasets: [
        {
          label: 'Hours',
          data: sortedData.map(d => d.hours),
          backgroundColor: '#4CAF50',
        }
      ]
    };
  }, [filteredEntries]);

  // Calculate yearly chart data
  const yearlyChartData = React.useMemo(() => {
    if (!user || !timeEntries.length) return { labels: [], datasets: [] };
    
    const currentYear = new Date().getFullYear();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Filter entries for current user and current year
    const yearEntries = timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entry.userId === user.id && entryDate.getFullYear() === currentYear;
    });
    
    // Group by month and category
    const monthCategoryData = {};
    
    yearEntries.forEach(entry => {
      const entryDate = new Date(entry.date);
      const month = entryDate.getMonth();
      const categoryId = entry.category;
      const hours = calculateHours(entry.startTime, entry.endTime);
      
      monthCategoryData[month] = monthCategoryData[month] || {};
      monthCategoryData[month][categoryId] = (monthCategoryData[month][categoryId] || 0) + hours;
    });
    
    // Create datasets for each category
    const datasets = [];
    categories.forEach(category => {
      const data = [];
      for (let i = 0; i < 12; i++) {
        data.push(monthCategoryData[i]?.[category.id] || 0);
      }
      
      datasets.push({
        categoryId: category.id.toString(),
        data,
        backgroundColor: category.color,
        label: category.name,
      });
    });
    
    return {
      labels: monthNames,
      datasets
    };
  }, [timeEntries, user, categories]);
  
  // State for chart filtering
  const [activeCategories, setActiveCategories] = useState(null);
  
  const toggleCategoryFilter = (categoryId) => {
    if (activeCategories === categoryId) {
      setActiveCategories(null); // Deselect
    } else {
      setActiveCategories(categoryId); // Select this category
    }
  };

  // Calculate upcoming holidays
  const upcomingHolidays = React.useMemo(() => {
    if (!user) return [];
    
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    return timeEntries
      .filter(entry => 
        entry.userId === user.id && 
        entry.type === 'holiday' && 
        new Date(entry.date) >= now
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5); // Show next 5 holidays
  }, [timeEntries, user]);

  // Handle date range changes
  const handlePreviousMonth = () => {
    const newStart = new Date(dateRange.start);
    newStart.setMonth(newStart.getMonth() - 1);
    
    const newEnd = new Date(newStart);
    newEnd.setMonth(newStart.getMonth() + 1);
    newEnd.setDate(0);
    
    setDateRange({ start: newStart, end: newEnd });
  };
  
  const handleNextMonth = () => {
    const newStart = new Date(dateRange.start);
    newStart.setMonth(newStart.getMonth() + 1);
    
    const newEnd = new Date(newStart);
    newEnd.setMonth(newStart.getMonth() + 1);
    newEnd.setDate(0);
    
    setDateRange({ start: newStart, end: newEnd });
  };

  // Handle adding new time entry
  const handleAddEntry = () => {
    const entry = {
      id: timeEntries.length + 1,
      userId: user.id,
      date: newEntry.date, // This is already in YYYY-MM-DD format from the date input
      startTime: newEntry.startTime,
      endTime: newEntry.endTime,
      category: categories.find(c => c.type === newEntry.type).id,
      type: newEntry.type,
      notes: newEntry.notes
    };
    
    // Log to verify the correct date is being stored
    console.log("Adding entry for date:", entry.date);
    
    setTimeEntries([...timeEntries, entry]);
    setShowAddModal(false);
    
    // Reset form
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '17:00',
      type: 'work',
      notes: ''
    });
  };

  // Handle editing time entry
  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setNewEntry({
      date: entry.date,
      startTime: entry.startTime,
      endTime: entry.endTime,
      type: entry.type,
      notes: entry.notes
    });
    setShowAddModal(true);
  };

  // Handle updating entry
  const handleUpdateEntry = () => {
    const updatedEntries = timeEntries.map(entry => {
      if (entry.id === editingEntry.id) {
        return {
          ...entry,
          date: newEntry.date,
          startTime: newEntry.startTime,
          endTime: newEntry.endTime,
          category: categories.find(c => c.type === newEntry.type).id,
          type: newEntry.type,
          notes: newEntry.notes
        };
      }
      return entry;
    });
    
    setTimeEntries(updatedEntries);
    setShowAddModal(false);
    setEditingEntry(null);
    
    // Reset form
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '17:00',
      type: 'work',
      notes: ''
    });
  };

  // Handle deleting entry
  const handleDeleteEntry = (id) => {
    const updatedEntries = timeEntries.filter(entry => entry.id !== id);
    setTimeEntries(updatedEntries);
  };

  // Handle shortcut keys for quick entry
  const handleShortcut = (key) => {
    const category = categories.find(c => c.shortcut === key);
    if (category) {
      setNewEntry({
        ...newEntry,
        type: category.type
      });
      setShowAddModal(true);
    }
  };

  // Set up key listeners for shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only trigger if Alt key is pressed along with shortcut
      if (e.altKey) {
        const key = e.key.toLowerCase();
        handleShortcut(key);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [categories]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="text-2xl font-semibold mb-4">Loading Time Track Pro...</div>
          <div className="h-2 w-64 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Clock className="h-8 w-8 mr-2 text-blue-500" /> 
            Time Track Pro
          </h1>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={user?.id || ''}
                onChange={(e) => setUser(users.find(u => u.id === Number(e.target.value)))}
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <button
              className="inline-flex items-center p-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setShowAddModal(true)}
              title="Add Time Entry"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              className={`px-3 py-4 text-sm font-medium ${activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="flex items-center">
                <Home className="h-4 w-4 mr-1" /> Dashboard
              </div>
            </button>
            
            <button
              className={`px-3 py-4 text-sm font-medium ${activeTab === 'timesheet' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('timesheet')}
            >
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" /> Timesheet
              </div>
            </button>
            
            <button
              className={`px-3 py-4 text-sm font-medium ${activeTab === 'calendar' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('calendar')}
            >
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" /> Calendar
              </div>
            </button>
            
            <button
              className={`px-3 py-4 text-sm font-medium ${activeTab === 'reports' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('reports')}
            >
              <div className="flex items-center">
                <BarChart2 className="h-4 w-4 mr-1" /> Reports
              </div>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Holiday Statistics */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Holiday Hours Left</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {stats.remainingHolidayHours?.toFixed(1) || 0}
                          </div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                            <span className="sr-only">of</span>
                            {user?.holidayAllocation || 0} total
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sick Leave Statistics */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Sick Leave Hours Used</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {stats.totalSickHours?.toFixed(1) || 0}
                          </div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                            <span className="sr-only">of</span>
                            {user?.sickLeaveAllocation || 0} total
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Remote Work Statistics */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Remote Work Hours</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {stats.totalRemoteHours?.toFixed(1) || 0}
                          </div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                            This Year
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {categories.map(category => {
                      // Choose appropriate icon based on category type
                      let icon;
                      switch (category.type) {
                        case 'work':
                          icon = <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                 </svg>;
                          break;
                        case 'remote':
                          icon = <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                 </svg>;
                          break;
                        case 'sick':
                          icon = <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                 </svg>;
                          break;
                        case 'holiday':
                          icon = <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                 </svg>;
                          break;
                        case 'overtime':
                          icon = <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                 </svg>;
                          break;
                        default:
                          icon = <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                 </svg>;
                      }
                      
                      return (
                        <button
                          key={category.id}
                          className="flex flex-col items-center justify-center p-2 border rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                          style={{
                            backgroundColor: `${category.color}15`,
                            borderColor: category.color,
                          }}
                          onClick={() => {
                            setNewEntry({...newEntry, type: category.type});
                            setShowAddModal(true);
                          }}
                        >
                          <div className="rounded-full p-2 mb-1" style={{backgroundColor: category.color}}>
                            <div className="text-white">
                              {icon}
                            </div>
                          </div>
                          <span className="font-medium text-xs text-gray-700">{category.name}</span>
                          <span className="text-xs text-gray-500 mt-0.5">Alt+{category.shortcut}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Upcoming Holidays */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Upcoming Holidays</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {upcomingHolidays.length === 0 ? (
                  <div className="px-4 py-5 sm:px-6 text-gray-500 italic">No upcoming holidays</div>
                ) : (
                  upcomingHolidays.map(entry => (
                    <div key={entry.id} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full mr-3" style={{backgroundColor: '#FF9800'}}></div>
                        <span className="font-medium text-gray-900">{new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {calculateHours(entry.startTime, entry.endTime)} hours
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Working Hours Chart */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Working Hours</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePreviousMonth}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <span className="text-sm font-medium text-gray-600">
                    {dateRange.start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button
                    onClick={handleNextMonth}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="h-64">
                  {/* This would be a real chart component in a full implementation */}
                  <div className="flex h-full">
                    {chartData.labels.map((label, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className="flex-1 w-full px-1 flex items-end">
                          <div 
                            className="w-full bg-green-500 rounded-t"
                            style={{ height: `${(chartData.datasets[0].data[index] / 10) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 truncate w-full text-center">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Timesheet */}
        {activeTab === 'timesheet' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Timesheet</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePreviousMonth}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <span className="text-sm font-medium text-gray-600">
                  {dateRange.start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEntries.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                        No time entries for this period
                      </td>
                    </tr>
                  ) : (
                    _.sortBy(filteredEntries, 'date').reverse().map(entry => {
                      const category = categories.find(c => c.id === entry.category);
                      return (
                        <tr key={entry.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="inline-flex items-center">
                              <span className="w-2 h-2 rounded-full mr-1" style={{backgroundColor: category?.color || '#ccc'}}></span>
                              {category?.name || entry.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.startTime}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.endTime}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {calculateHours(entry.startTime, entry.endTime)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{entry.notes}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditEntry(entry)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteEntry(entry.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Calendar View */}
        {activeTab === 'calendar' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Calendar View</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePreviousMonth}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <span className="text-sm font-medium text-gray-600">
                  {dateRange.start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-7 gap-px bg-gray-200 border rounded">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                
                {(() => {
                  const days = [];
                  const startDate = new Date(dateRange.start);
                  const endDate = new Date(dateRange.end);
                  
                  // Get the first day of the month
                  const firstDay = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
                  const startingDayOfWeek = firstDay.getDay();
                  
                  // Add empty cells for days before the first day of the month
                  for (let i = 0; i < startingDayOfWeek; i++) {
                    days.push(
                      <div key={`empty-start-${i}`} className="bg-white p-2 h-24 text-center text-sm text-gray-300">
                        &nbsp;
                      </div>
                    );
                  }
                  
                  // Add days of the month
                  const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
                  for (let i = 1; i <= daysInMonth; i++) {
                    const date = new Date(startDate.getFullYear(), startDate.getMonth(), i);
                    // Format date to YYYY-MM-DD for comparison with entry dates
                    const dateString = date.toISOString().split('T')[0];
                    
                    // Find entries that match this exact date string
                    const dayEntries = filteredEntries.filter(entry => entry.date === dateString);
                    
                    days.push(
                      <div key={`day-${i}`} className="bg-white p-2 h-24 overflow-auto relative">
                        <div className="text-right font-semibold text-sm mb-1">
                          {i}
                        </div>
                        
                        {dayEntries.length > 0 ? (
                          <div className="space-y-1">
                            {dayEntries.map(entry => {
                              const category = categories.find(c => c.id === entry.category);
                              return (
                                <div 
                                  key={entry.id} 
                                  className="text-xs p-1 rounded truncate cursor-pointer"
                                  style={{backgroundColor: `${category?.color}30`}}
                                  onClick={() => handleEditEntry(entry)}
                                >
                                  {entry.startTime}-{entry.endTime} {category?.name || entry.type}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400 italic">No entries</div>
                        )}
                      </div>
                    );
                  }
                  
                  // Add empty cells for days after the last day of the month
                  const lastDay = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
                  const endingDayOfWeek = lastDay.getDay();
                  const emptyCellsToAdd = 6 - endingDayOfWeek;
                  
                  for (let i = 0; i < emptyCellsToAdd; i++) {
                    days.push(
                      <div key={`empty-end-${i}`} className="bg-white p-2 h-24 text-center text-sm text-gray-300">
                        &nbsp;
                      </div>
                    );
                  }
                  
                  return days;
                })()}
              </div>
            </div>
          </div>
        )}
        
        {/* Reports View */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Reports</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="border rounded-lg p-4">
                    <h4 className="text-base font-medium text-gray-900 mb-4">Time by Category</h4>
                    <div className="space-y-3">
                      {categories.map(category => {
                        const totalHours = filteredEntries
                          .filter(entry => entry.category === category.id)
                          .reduce((sum, entry) => sum + calculateHours(entry.startTime, entry.endTime), 0);
                        
                        const percentage = filteredEntries.length ? 
                          (totalHours / filteredEntries.reduce((sum, entry) => sum + calculateHours(entry.startTime, entry.endTime), 0)) * 100 : 0;
                        
                        return (
                          <div key={category.id}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-gray-700 flex items-center">
                                <span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: category.color}}></span>
                                {category.name}
                              </span>
                              <span className="text-gray-500">{totalHours.toFixed(1)} hours</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full" 
                                style={{width: `${percentage}%`, backgroundColor: category.color}}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="text-base font-medium text-gray-900 mb-4">Working Hours Summary</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Average Daily Hours</div>
                        <div className="text-3xl font-bold text-gray-900">
                          {chartData.datasets[0]?.data?.length ? 
                            (chartData.datasets[0].data.reduce((sum, h) => sum + h, 0) / chartData.datasets[0].data.length).toFixed(1) : 
                            '0.0'}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Total Hours This Month</div>
                        <div className="text-3xl font-bold text-gray-900">
                          {chartData.datasets[0]?.data?.reduce((sum, h) => sum + h, 0).toFixed(1) || '0.0'}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Remote Work Percentage</div>
                        <div className="text-3xl font-bold text-gray-900">
                          {filteredEntries.length ? 
                            ((filteredEntries.filter(e => e.type === 'remote').length / filteredEntries.length) * 100).toFixed(1) + '%' : 
                            '0.0%'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Yearly Stacked Bar Chart */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Yearly Overview by Category</h3>
              </div>
              <div className="p-6">
                <div className="h-96">
                  {yearlyChartData.labels.length > 0 ? (
                    <div className="w-full h-full">
                      <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4">
                          <div className="text-sm font-medium text-gray-700">Hours by Month and Category - {new Date().getFullYear()}</div>
                          <div className="flex flex-wrap justify-end space-x-4">
                            {categories.map(category => (
                              <div 
                                key={category.id} 
                                className="flex items-center cursor-pointer p-1 rounded transition-all duration-150"
                                style={{
                                  opacity: activeCategories === null || activeCategories === category.id ? 1 : 0.5,
                                  background: activeCategories === category.id ? `${category.color}20` : 'transparent'
                                }}
                                onClick={() => toggleCategoryFilter(category.id)}
                              >
                                <div 
                                  className="w-3 h-3 rounded-full mr-1" 
                                  style={{backgroundColor: category.color}}
                                ></div>
                                <span className="text-xs text-gray-600">{category.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex-1 flex items-end">
                          <div className="mr-6 h-full flex flex-col justify-between">
                            {[0, 25, 50, 75, 100, 125, 150].reverse().map(value => (
                              <div key={value} className="text-xs text-gray-500">{value}</div>
                            ))}
                          </div>
                          <div className="flex-1 flex items-end space-x-2">
                            {yearlyChartData.labels.map((month, monthIndex) => {
                              // Calculate total height for this month
                              const totalHours = yearlyChartData.datasets.reduce(
                                (sum, dataset) => sum + (dataset.data[monthIndex] || 0), 0
                              );
                              
                              return (
                                <div key={month} className="flex-1 flex flex-col items-center">
                                  <div className="h-72 flex flex-col-reverse w-full">
                                    {yearlyChartData.datasets.map((dataset, i) => {
                                      const hours = dataset.data[monthIndex] || 0;
                                      if (hours === 0) return null;
                                      
                                      const heightPercentage = (hours / 150) * 100; // 150 max hours per month
                                      const categoryId = parseInt(dataset.categoryId);
                                      const category = categories.find(c => c.id === categoryId);
                                      
                                      // Determine if this category should be highlighted
                                      const isActive = activeCategories === null || activeCategories === categoryId;
                                      
                                      return (
                                        <div 
                                          key={i}
                                          className="w-full rounded-t mx-px mb-px relative group transition-opacity duration-200"
                                          style={{
                                            height: `${heightPercentage}%`,
                                            backgroundColor: category?.color || '#ccc',
                                            opacity: isActive ? 1 : 0.3,
                                            cursor: 'pointer'
                                          }}
                                          onClick={() => toggleCategoryFilter(categoryId)}
                                        >
                                          {/* Tooltip on hover */}
                                          <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none whitespace-nowrap z-10">
                                            <div className="text-center font-medium">{category?.name}</div>
                                            <div>{hours.toFixed(1)} hours</div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <div className="mt-2 text-xs text-gray-500">{month}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 italic">
                      No data available for yearly chart
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Add/Edit Time Entry Modal */}
      {showAddModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              {/* Colored header based on selected category */}
              <div 
                className="px-6 py-4 border-b flex justify-between items-center" 
                style={{
                  backgroundColor: categories.find(c => c.type === newEntry.type)?.color || '#4F46E5',
                  color: 'white'
                }}
              >
                <div className="flex items-center">
                  {/* Icon for the category type */}
                  {(() => {
                    // Choose icon based on type
                    switch(newEntry.type) {
                      case 'work':
                        return (
                          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        );
                      case 'remote':
                        return (
                          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        );
                      case 'sick':
                        return (
                          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        );
                      case 'holiday':
                        return (
                          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        );
                      case 'overtime':
                        return (
                          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        );
                      default:
                        return null;
                    }
                  })()}
                  <h3 className="text-lg font-medium">
                    {editingEntry ? 'Edit Time Entry' : 'Add Time Entry'}: {categories.find(c => c.type === newEntry.type)?.name}
                  </h3>
                </div>
                <button 
                  type="button" 
                  className="rounded-full p-1 hover:bg-white hover:bg-opacity-20 transition-colors duration-200"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingEntry(null);
                    setNewEntry({
                      date: new Date().toISOString().split('T')[0],
                      startTime: '09:00',
                      endTime: '17:00',
                      type: 'work',
                      notes: ''
                    });
                  }}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="bg-white px-6 py-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <div className="flex space-x-2">
                      <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          type="date"
                          id="date"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newEntry.date}
                          onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                        />
                      </div>
                      
                      {/* Quick date buttons */}
                      <div className="flex space-x-1">
                        <button
                          type="button"
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700"
                          onClick={() => {
                            const yesterday = new Date();
                            yesterday.setDate(yesterday.getDate() - 1);
                            setNewEntry({...newEntry, date: yesterday.toISOString().split('T')[0]});
                          }}
                          title="Yesterday"
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          className="px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded text-xs font-medium text-blue-700"
                          onClick={() => {
                            const today = new Date();
                            setNewEntry({...newEntry, date: today.toISOString().split('T')[0]});
                          }}
                          title="Today"
                        >
                          Today
                        </button>
                        <button
                          type="button"
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700"
                          onClick={() => {
                            const tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            setNewEntry({...newEntry, date: tomorrow.toISOString().split('T')[0]});
                          }}
                          title="Tomorrow"
                        >
                          +1
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <input
                            type="time"
                            id="startTime"
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={newEntry.startTime}
                            onChange={(e) => setNewEntry({...newEntry, startTime: e.target.value})}
                          />
                        </div>
                        
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <input
                            type="time"
                            id="endTime"
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={newEntry.endTime}
                            onChange={(e) => setNewEntry({...newEntry, endTime: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      {/* Quick time presets */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        <button
                          type="button"
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700"
                          onClick={() => setNewEntry({...newEntry, startTime: '09:00', endTime: '17:00'})}
                        >
                          Full Day (9-5)
                        </button>
                        <button
                          type="button"
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700"
                          onClick={() => setNewEntry({...newEntry, startTime: '09:00', endTime: '13:00'})}
                        >
                          Morning (9-1)
                        </button>
                        <button
                          type="button"
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700"
                          onClick={() => setNewEntry({...newEntry, startTime: '13:00', endTime: '17:00'})}
                        >
                          Afternoon (1-5)
                        </button>
                        <button
                          type="button"
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700"
                          onClick={() => setNewEntry({...newEntry, startTime: '17:00', endTime: '19:00'})}
                        >
                          Overtime (5-7)
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <div className="grid grid-cols-5 gap-2">
                      {categories.map(category => (
                        <button
                          key={category.id}
                          type="button"
                          className={`flex items-center p-2 border rounded-md transition-all duration-200 ${
                            newEntry.type === category.type 
                              ? 'ring-2 ring-offset-2 shadow-md' 
                              : 'shadow-sm hover:shadow'
                          }`}
                          style={{
                            backgroundColor: newEntry.type === category.type ? `${category.color}20` : 'white',
                            borderColor: newEntry.type === category.type ? category.color : '#e2e8f0',
                            ringColor: category.color
                          }}
                          onClick={() => setNewEntry({...newEntry, type: category.type})}
                        >
                          <div 
                            className="rounded-full p-1 mr-2" 
                            style={{
                              backgroundColor: category.color
                            }}
                          >
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              {category.type === 'work' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                              {category.type === 'remote' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />}
                              {category.type === 'sick' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                              {category.type === 'holiday' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
                              {category.type === 'overtime' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                            </svg>
                          </div>
                          <span className="text-xs font-medium">{category.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      id="notes"
                      rows="3"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newEntry.notes}
                      onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                      placeholder="Add any additional details here..."
                    ></textarea>
                  </div>
                </div>
                
                {/* Calculate hours in real time */}
                <div className="mt-4 bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Duration:</span>
                    <span className="text-lg font-bold" style={{color: categories.find(c => c.type === newEntry.type)?.color}}>
                      {calculateHours(newEntry.startTime, newEntry.endTime).toFixed(1)} hours
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingEntry(null);
                    setNewEntry({
                      date: new Date().toISOString().split('T')[0],
                      startTime: '09:00',
                      endTime: '17:00',
                      type: 'work',
                      notes: ''
                    });
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{
                    backgroundColor: categories.find(c => c.type === newEntry.type)?.color || '#4F46E5',
                  }}
                  onClick={editingEntry ? handleUpdateEntry : handleAddEntry}
                >
                  {editingEntry ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
