import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  addButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  noteCard: {
    backgroundColor: '#d8f3d8',
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 10,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  titleContainer: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  noteContent: {
    marginTop: 10,
    fontSize: 14,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 10,
  },
  iconText: {
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
    width: '100%',
    marginBottom: 80, // Add space at the bottom for the buttons
  },
  scrollViewContent: {
    paddingBottom: 20, // Additional padding at the bottom of the content
  },
  recordButtonImage: {
    width: 70,
    height: 100,
    resizeMode: 'contain',
  },
  recordButtonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButton: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default styles;