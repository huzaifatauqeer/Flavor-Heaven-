import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// Register a modern font
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v29/KFOmCnqEu92Fr1Mu4mxM.woff2' }, // Regular
    { src: 'https://fonts.gstatic.com/s/roboto/v29/KFOlCnqEu92Fr1MmWUlfBBc9.woff2', fontWeight: 'bold' }, // Bold
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Roboto',
    backgroundColor: '#f6f6f6',
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1f2937',
  },
  subHeader: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#4b5563',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#9ca3af',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
  },
  tableColHeader: {
    width: '25%',
    fontWeight: 'bold',
  },
  tableCol: {
    width: '25%',
  },
  summaryContainer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#9ca3af',
    alignItems: 'flex-end',
  },
  summaryText: {
    fontSize: 12,
    marginBottom: 4,
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

interface BillItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

interface InvoiceProps {
  hotelName: string;
  date: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card';
}

const Invoice: React.FC<InvoiceProps> = ({
  hotelName,
  date,
  items,
  subtotal,
  tax,
  total,
  paymentMethod,
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>{hotelName}</Text>
        <Text style={styles.subHeader}>Invoice Date: {date}</Text>

        <View style={styles.tableHeader}>
          <Text style={styles.tableColHeader}>Item</Text>
          <Text style={styles.tableColHeader}>Qty</Text>
          <Text style={styles.tableColHeader}>Price</Text>
          <Text style={styles.tableColHeader}>Total</Text>
        </View>

        {items.map((item, idx) => (
          <View
            key={item.id}
            style={{
              ...styles.tableRow,
              backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f3f4f6',
            }}
          >
            <Text style={styles.tableCol}>{item.name}</Text>
            <Text style={styles.tableCol}>{item.quantity}</Text>
            <Text style={styles.tableCol}>Rs. {item.price}</Text>
            <Text style={styles.tableCol}>Rs. {item.price * item.quantity}</Text>
          </View>
        ))}

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>Payment Method: {paymentMethod}</Text>
          <Text style={styles.summaryText}>Subtotal: Rs. {subtotal.toFixed(0)}</Text>
          <Text style={styles.summaryText}>Tax: Rs. {tax.toFixed(0)}</Text>
          <Text style={styles.totalText}>Total: Rs. {total.toFixed(0)}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default Invoice;
