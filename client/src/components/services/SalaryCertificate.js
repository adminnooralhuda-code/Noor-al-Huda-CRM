import React, { useState } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import Layout from '../Layout';

// അറബിക് ഫോണ്ട് രജിസ്റ്റർ ചെയ്യുന്നു
Font.register({
  family: 'Amiri',
  src: 'https://fonts.gstatic.com/s/amiri/v26/J7afp96_zW_5l-N_W7it.ttf',
});

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Amiri', backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', borderBottom: 2, borderColor: '#005088', paddingBottom: 10, marginBottom: 20 },
  logo: { width: 60, height: 40 },
  title: { fontSize: 20, textAlign: 'center', fontWeight: 'bold', color: '#005088' },
  date: { fontSize: 10, textAlign: 'right', marginBottom: 20 },
  addressedTo: { fontSize: 12, marginBottom: 20 },
  contentRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 15 },
  contentTextAr: { fontSize: 11, textAlign: 'right', width: '48%' },
  contentTextEn: { fontSize: 11, textAlign: 'left', width: '48%' },
  table: { marginTop: 20, borderTop: 1, borderColor: '#eee' },
  tableRow: { flexDirection: 'row-reverse', borderBottom: 1, borderColor: '#eee', padding: 5 },
  label: { fontSize: 10, width: '60%', textAlign: 'right' },
  value: { fontSize: 10, width: '40%', textAlign: 'left', fontWeight: 'bold' },
  totalRow: { flexDirection: 'row-reverse', marginTop: 10, padding: 5, backgroundColor: '#f9f9f9' },
  footerLine: { marginTop: 50, borderTop: 2, borderColor: '#005088', paddingTop: 10 },
  footerColor: { height: 4, flexDirection: 'row', position: 'absolute', bottom: 40, left: 40, right: 40 },
  signatureSection: { marginTop: 30 },
});

const CertificatePDF = ({ data, logo }) => {
  const total = parseFloat(data.basic || 0) + parseFloat(data.housing || 0) + parseFloat(data.transport || 0) + parseFloat(data.other || 0);
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {logo && <Image src={logo} style={styles.logo} />}
          <View>
            <Text style={styles.title}>SALARY CERTIFICATE / شهادة راتب</Text>
          </View>
        </View>

        <Text style={styles.date}>Date / التاريخ: {new Date().toLocaleDateString()}</Text>
        <Text style={styles.addressedTo}>{data.addrToEn} / {data.addrToAr}</Text>

        <View style={styles.contentRow}>
          <Text style={styles.contentTextAr}>تشهد الشركة بأن السيد/ة {data.empNameAr}، {data.nationalityAr} الجنسية، يعمل لدينا بمهنة {data.desAr}.</Text>
          <Text style={styles.contentTextEn}>This is to certify that Mr./Ms. {data.empNameEn}, a {data.nationalityEn} national, is employed as {data.desEn}.</Text>
        </View>

        <View style={styles.table}>
            {[
                { en: "Basic Salary", ar: "الراتب الأساسي", val: data.basic },
                { en: "Housing Allowance", ar: "بدل السكن", val: data.housing },
                { en: "Transport Allowance", ar: "بدل المواصلات", val: data.transport },
                { en: "Other Allowance", ar: "بدل أخرى", val: data.other }
            ].map((row, i) => (
                <View key={i} style={styles.tableRow}>
                    <Text style={styles.label}>{row.en} / {row.ar}</Text>
                    <Text style={styles.value}>AED {row.val}</Text>
                </View>
            ))}
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.label}>Total Gross Monthly Salary / إجمالي الراتب الشهري</Text>
          <Text style={styles.value}>AED {total.toFixed(2)}</Text>
        </View>

        <View style={styles.signatureSection}>
          <Text style={{fontSize: 11}}>{data.mNameEn} / {data.mNameAr}</Text>
          <Text style={{fontSize: 10, color: '#666'}}>{data.mPosEn} / {data.mPosAr}</Text>
          <Text style={{fontSize: 10, fontWeight: 'bold'}}>{data.compEn} / {data.compAr}</Text>
        </View>

        <View style={styles.footerColor}>
            <View style={{flex: 3, backgroundColor: '#005088'}} />
            <View style={{flex: 1, backgroundColor: '#FF9900'}} />
        </View>
      </Page>
    </Document>
  );
};

const SalaryCertificate = () => {
    const [data, setData] = useState({
        empNameEn: '', empNameAr: '', nationalityEn: '', nationalityAr: '',
        desEn: '', desAr: '', compEn: '', compAr: '', mNameEn: '', mNameAr: '', 
        mPosEn: '', mPosAr: '', addrToEn: 'To Whom It May Concern', addrToAr: 'إلى من يهمه الأمر',
        basic: 0, housing: 0, transport: 0, other: 0
    });
    const [logo, setLogo] = useState(null);

    return (
        <Layout>
            <div className="container mt-4 pb-5">
                <div className="card p-4 shadow border-0">
                    <h4 className="text-center mb-4 text-primary">Advanced Bilingual Salary Certificate Generator</h4>
                    <div className="row g-3">
                        {[
                            { label: "Employee Name", k1: "empNameEn", k2: "empNameAr" },
                            { label: "Nationality", k1: "nationalityEn", k2: "nationalityAr" },
                            { label: "Designation", k1: "desEn", k2: "desAr" },
                            { label: "Company Name", k1: "compEn", k2: "compAr" },
                            { label: "Manager Name", k1: "mNameEn", k2: "mNameAr" },
                            { label: "Manager Position", k1: "mPosEn", k2: "mPosAr" }
                        ].map((f, i) => (
                            <div className="col-md-6" key={i}>
                                <label className="fw-bold small">{f.label}</label>
                                <div className="input-group">
                                    <input className="form-control" placeholder="English" onChange={(e)=>setData({...data, [f.k1]: e.target.value})}/>
                                    <input className="form-control text-end" placeholder="عربي" onChange={(e)=>setData({...data, [f.k2]: e.target.value})}/>
                                </div>
                            </div>
                        ))}
                        <div className="col-md-3"><label className="small fw-bold">Basic</label><input type="number" className="form-control" onChange={(e)=>setData({...data, basic: e.target.value})}/></div>
                        <div className="col-md-3"><label className="small fw-bold">Housing</label><input type="number" className="form-control" onChange={(e)=>setData({...data, housing: e.target.value})}/></div>
                        <div className="col-md-3"><label className="small fw-bold">Transport</label><input type="number" className="form-control" onChange={(e)=>setData({...data, transport: e.target.value})}/></div>
                        <div className="col-md-3"><label className="small fw-bold">Other</label><input type="number" className="form-control" onChange={(e)=>setData({...data, other: e.target.value})}/></div>
                        <div className="col-md-12"><label className="small fw-bold">Upload Company Logo</label><input type="file" className="form-control" onChange={(e)=>{const r=new FileReader(); r.onload=(e)=>setLogo(e.target.result); r.readAsDataURL(e.target.files[0]);}}/></div>
                        
                        <div className="col-md-12 mt-4 text-center">
                            <PDFDownloadLink document={<CertificatePDF data={data} logo={logo} />} fileName={`${data.empNameEn}_Certificate.pdf`} className="btn btn-primary btn-lg px-5 shadow">
                                {({ loading }) => (loading ? 'Preparing Document...' : 'Generate & Download Official PDF')}
                            </PDFDownloadLink>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SalaryCertificate;