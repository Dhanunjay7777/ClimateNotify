// PDF Generation Service using jsPDF and Chart.js
// Free libraries for client-side PDF generation with charts

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Chart from 'chart.js/auto';

class PDFGenerationService {
  constructor() {
    this.doc = null;
    this.pageWidth = 210; // A4 width in mm
    this.pageHeight = 297; // A4 height in mm
    this.margins = { top: 20, right: 20, bottom: 20, left: 20 };
  }

  // Initialize new PDF document
  initializeDocument() {
    this.doc = new jsPDF();
    return this.doc;
  }

  // Add header to the document
  addHeader(title, subtitle, reportData) {
    const doc = this.doc;
    
    // Title
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text(title, this.margins.left, 30);
    
    // Subtitle
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text(subtitle, this.margins.left, 40);
    
    // Report metadata
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date(reportData.metadata.generatedAt).toLocaleString()}`, this.margins.left, 50);
    doc.text(`Region: ${reportData.metadata.region}`, this.margins.left, 55);
    doc.text(`Period: ${new Date(reportData.metadata.period.start).toLocaleDateString()} - ${new Date(reportData.metadata.period.end).toLocaleDateString()}`, this.margins.left, 60);
    
    // Add line separator
    doc.setLineWidth(0.5);
    doc.line(this.margins.left, 65, this.pageWidth - this.margins.right, 65);
    
    return 70; // Return Y position for next content
  }

  // Add executive summary
  addExecutiveSummary(reportData, startY) {
    const doc = this.doc;
    let currentY = startY + 10;
    
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Executive Summary', this.margins.left, currentY);
    currentY += 10;
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    
    // Generate summary text based on data
    const summary = this.generateExecutiveSummary(reportData);
    const summaryLines = doc.splitTextToSize(summary, this.pageWidth - this.margins.left - this.margins.right);
    
    summaryLines.forEach(line => {
      if (currentY > this.pageHeight - this.margins.bottom - 20) {
        doc.addPage();
        currentY = this.margins.top;
      }
      doc.text(line, this.margins.left, currentY);
      currentY += 6;
    });
    
    return currentY + 10;
  }

  // Generate executive summary text
  generateExecutiveSummary(reportData) {
    const { analysis, current } = reportData;
    let summary = `This climate report provides comprehensive analysis for ${reportData.metadata.region}. `;
    
    if (analysis.temperatureTrends) {
      const trend = analysis.temperatureTrends.trend > 0 ? 'warming' : 'cooling';
      summary += `Current temperature is ${current.temperature}°C with an average of ${analysis.temperatureTrends.average}°C over the period. The region shows a ${trend} trend of ${Math.abs(analysis.temperatureTrends.trend)}°C. `;
    }
    
    if (analysis.precipitationPatterns) {
      summary += `Total precipitation recorded was ${analysis.precipitationPatterns.total}mm with ${analysis.precipitationPatterns.rainyDays} rainy days. `;
    }
    
    if (analysis.extremeEvents) {
      const eventCount = analysis.extremeEvents.length;
      if (eventCount > 0) {
        summary += `${eventCount} extreme weather events were recorded during this period, requiring continued monitoring. `;
      } else {
        summary += `No significant extreme weather events were recorded during this period. `;
      }
    }
    
    summary += `Current conditions show ${current.conditions} with humidity at ${current.humidity}% and wind speeds of ${current.windSpeed} km/h.`;
    
    return summary;
  }

  // Add temperature analysis section
  addTemperatureAnalysis(analysis, startY) {
    const doc = this.doc;
    let currentY = startY;
    
    if (!analysis.temperatureTrends) return currentY;
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Temperature Analysis', this.margins.left, currentY);
    currentY += 15;
    
    // Temperature statistics table
    const tempData = [
      ['Metric', 'Value', 'Unit'],
      ['Average Temperature', analysis.temperatureTrends.average.toString(), '°C'],
      ['Maximum Temperature', analysis.temperatureTrends.max.toString(), '°C'],
      ['Minimum Temperature', analysis.temperatureTrends.min.toString(), '°C'],
      ['Temperature Trend', analysis.temperatureTrends.trend.toString(), '°C/day']
    ];
    
    autoTable(doc, {
      head: [tempData[0]],
      body: tempData.slice(1),
      startY: currentY,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: this.margins.left, right: this.margins.right }
    });
    
    return doc.lastAutoTable.finalY + 15;
  }

  // Add precipitation analysis section
  addPrecipitationAnalysis(analysis, startY) {
    const doc = this.doc;
    let currentY = startY;
    
    if (!analysis.precipitationPatterns) return currentY;
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Precipitation Analysis', this.margins.left, currentY);
    currentY += 15;
    
    // Precipitation statistics table
    const precipData = [
      ['Metric', 'Value', 'Unit'],
      ['Total Precipitation', analysis.precipitationPatterns.total.toString(), 'mm'],
      ['Average Daily Precipitation', analysis.precipitationPatterns.average.toString(), 'mm'],
      ['Rainy Days', analysis.precipitationPatterns.rainyDays.toString(), 'days'],
      ['Maximum Daily Precipitation', analysis.precipitationPatterns.maxDaily.toString(), 'mm']
    ];
    
    autoTable(doc, {
      head: [precipData[0]],
      body: precipData.slice(1),
      startY: currentY,
      theme: 'striped',
      headStyles: { fillColor: [46, 204, 113] },
      margin: { left: this.margins.left, right: this.margins.right }
    });
    
    return doc.lastAutoTable.finalY + 15;
  }

  // Add extreme events section
  addExtremeEvents(analysis, startY) {
    const doc = this.doc;
    let currentY = startY;
    
    if (!analysis.extremeEvents || analysis.extremeEvents.length === 0) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Extreme Weather Events', this.margins.left, currentY);
      currentY += 15;
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text('No extreme weather events recorded during this period.', this.margins.left, currentY);
      
      return currentY + 20;
    }
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Extreme Weather Events', this.margins.left, currentY);
    currentY += 15;
    
    // Extreme events table
    const eventsData = [
      ['Date', 'Event Type', 'Value', 'Unit', 'Severity'],
      ...analysis.extremeEvents.slice(0, 10).map(event => [
        new Date(event.date).toLocaleDateString(),
        event.type,
        event.value.toString(),
        event.unit,
        event.severity
      ])
    ];
    
    autoTable(doc, {
      head: [eventsData[0]],
      body: eventsData.slice(1),
      startY: currentY,
      theme: 'striped',
      headStyles: { fillColor: [231, 76, 60] },
      margin: { left: this.margins.left, right: this.margins.right }
    });
    
    return doc.lastAutoTable.finalY + 15;
  }

  // Generate chart and add to PDF
  async addChart(title, chartData, chartType, startY) {
    const doc = this.doc;
    let currentY = startY;
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(title, this.margins.left, currentY);
    currentY += 10;
    
    try {
      // Create canvas element for chart
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      
      // Create chart
      const chart = new Chart(ctx, {
        type: chartType,
        data: chartData,
        options: {
          responsive: false,
          animation: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          },
          scales: chartType !== 'pie' ? {
            y: {
              beginAtZero: true
            }
          } : {}
        }
      });
      
      // Wait for chart to render
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Convert canvas to image and add to PDF
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = this.pageWidth - this.margins.left - this.margins.right;
      const imgHeight = (canvas.height / canvas.width) * imgWidth;
      
      doc.addImage(imgData, 'PNG', this.margins.left, currentY, imgWidth, imgHeight);
      
      // Cleanup
      chart.destroy();
      canvas.remove();
      
      return currentY + imgHeight + 10;
      
    } catch (error) {
      console.error('Error generating chart:', error);
      // Fallback to simple visualization
      return this.addSimpleVisualization(title, chartData, startY);
    }
  }
  
  // Fallback simple visualization
  addSimpleVisualization(title, data, startY) {
    const doc = this.doc;
    let currentY = startY + 10;
    
    // Draw simple bar chart representation
    doc.setDrawColor(100, 100, 100);
    doc.setFillColor(41, 128, 185);
    
    const chartWidth = this.pageWidth - this.margins.left - this.margins.right - 40;
    const chartHeight = 60;
    const maxValue = Math.max(...data.datasets[0].data);
    
    data.labels.slice(0, 10).forEach((label, index) => {
      const barHeight = (data.datasets[0].data[index] / maxValue) * chartHeight;
      const x = this.margins.left + 20 + (index * (chartWidth / 10));
      const y = currentY + chartHeight - barHeight;
      
      // Draw bar
      doc.rect(x, y, chartWidth / 12, barHeight, 'F');
      
      // Add label (rotated)
      doc.setFontSize(8);
      doc.text(label.substring(0, 5), x + 2, currentY + chartHeight + 8);
    });
    
    return currentY + chartHeight + 20;
  }

  // Add historical data table
  addHistoricalDataTable(historicalData, startY) {
    const doc = this.doc;
    let currentY = startY;
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Historical Data Sample', this.margins.left, currentY);
    currentY += 15;
    
    // Show last 10 days of data
    const recentData = historicalData.slice(-10);
    const tableData = [
      ['Date', 'Temp (°C)', 'Humidity (%)', 'Precip (mm)', 'Wind (km/h)', 'Conditions'],
      ...recentData.map(day => [
        new Date(day.date).toLocaleDateString(),
        day.temperature.avg.toFixed(1),
        day.humidity.toFixed(0),
        day.precipitation.toFixed(1),
        day.windSpeed.toFixed(1),
        day.conditions
      ])
    ];
    
    autoTable(doc, {
      head: [tableData[0]],
      body: tableData.slice(1),
      startY: currentY,
      theme: 'striped',
      headStyles: { fillColor: [52, 73, 94] },
      margin: { left: this.margins.left, right: this.margins.right },
      styles: { fontSize: 8 }
    });
    
    return doc.lastAutoTable.finalY + 15;
  }

  // Add footer
  addFooter() {
    const doc = this.doc;
    const pageCount = doc.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      doc.text(
        `Climate Notify Report - Page ${i} of ${pageCount}`,
        this.pageWidth / 2,
        this.pageHeight - 10,
        { align: 'center' }
      );
      doc.text(
        'Generated by Climate Notify System',
        this.margins.left,
        this.pageHeight - 10
      );
      doc.text(
        new Date().toLocaleDateString(),
        this.pageWidth - this.margins.right,
        this.pageHeight - 10,
        { align: 'right' }
      );
    }
  }

  // Generate chart data for temperature trends
  generateTemperatureChartData(historicalData) {
    const last30Days = historicalData.slice(-30);
    return {
      labels: last30Days.map(day => new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [{
        label: 'Temperature (°C)',
        data: last30Days.map(day => day.temperature.avg),
        borderColor: 'rgb(41, 128, 185)',
        backgroundColor: 'rgba(41, 128, 185, 0.2)',
        tension: 0.1
      }]
    };
  }
  
  // Generate chart data for precipitation patterns
  generatePrecipitationChartData(historicalData) {
    const last30Days = historicalData.slice(-30);
    return {
      labels: last30Days.map(day => new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [{
        label: 'Precipitation (mm)',
        data: last30Days.map(day => day.precipitation),
        backgroundColor: 'rgba(46, 204, 113, 0.6)',
        borderColor: 'rgb(46, 204, 113)',
        borderWidth: 1
      }]
    };
  }

  // Generate complete climate report PDF
  async generateClimateReportPDF(reportData, reportType) {
    try {
      this.initializeDocument();
      
      // Determine report title based on type
      const titles = {
        comprehensive: 'Comprehensive Climate Report',
        temperature: 'Temperature Analysis Report',
        precipitation: 'Precipitation Patterns Report',
        extreme: 'Extreme Weather Events Report',
        co2: 'CO₂ Emissions Report',
        alerts: 'Climate Alert Summary'
      };
      
      const title = titles[reportType] || 'Climate Report';
      const subtitle = `Climate Analysis for ${reportData.metadata.region}`;
      
      // Add content sections
      let currentY = this.addHeader(title, subtitle, reportData);
      currentY = this.addExecutiveSummary(reportData, currentY);
      
      // Add analysis sections based on report type
      if (reportType === 'comprehensive' || reportType === 'temperature') {
        if (currentY > this.pageHeight - 100) {
          this.doc.addPage();
          currentY = this.margins.top;
        }
        currentY = this.addTemperatureAnalysis(reportData.analysis, currentY);
        
        // Add temperature chart
        const tempChartData = this.generateTemperatureChartData(reportData.historical);
        currentY = await this.addChart('Temperature Trends', tempChartData, 'line', currentY);
      }
      
      if (reportType === 'comprehensive' || reportType === 'precipitation') {
        if (currentY > this.pageHeight - 100) {
          this.doc.addPage();
          currentY = this.margins.top;
        }
        currentY = this.addPrecipitationAnalysis(reportData.analysis, currentY);
        
        // Add precipitation chart
        const precipChartData = this.generatePrecipitationChartData(reportData.historical);
        currentY = await this.addChart('Precipitation Patterns', precipChartData, 'bar', currentY);
      }
      
      if (reportType === 'comprehensive' || reportType === 'extreme') {
        if (currentY > this.pageHeight - 100) {
          this.doc.addPage();
          currentY = this.margins.top;
        }
        currentY = this.addExtremeEvents(reportData.analysis, currentY);
      }
      
      // Add historical data table
      if (currentY > this.pageHeight - 100) {
        this.doc.addPage();
        currentY = this.margins.top;
      }
      this.addHistoricalDataTable(reportData.historical, currentY);
      
      // Add footer to all pages
      this.addFooter();
      
      // Generate blob and download URL
      const pdfBlob = this.doc.output('blob');
      const downloadUrl = URL.createObjectURL(pdfBlob);
      
      // Calculate file size
      const fileSizeKB = (pdfBlob.size / 1024).toFixed(1);
      
      return {
        blob: pdfBlob,
        downloadUrl,
        fileName: `climate-report-${reportData.metadata.region.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`,
        fileSize: `${fileSizeKB} KB`,
        generatedAt: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Error generating PDF report:', error);
      throw new Error('Failed to generate PDF report: ' + error.message);
    }
  }
}

export default new PDFGenerationService();