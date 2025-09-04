const styles = {
  circle: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: 'hsl(var(--primary))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '0px', // אין רווח בין העיגול לכותרת
  },
  circleText: {
    color: 'white',
    fontWeight: 'bold', // שים לב שהשתנה מ-'solid' ל-'bold'
    fontSize: '22px', // הקטנת גודל הכתב
    lineHeight: '30px', // מרכז את הכתב vertically בעיגול
  },
};
// עיגול עם הטקסט
const PinkCircle = () => {
  return (
    <div style={styles.circle}>
      <span style={styles.circleText}>JL</span>
    </div>
  );
};
export default PinkCircle;