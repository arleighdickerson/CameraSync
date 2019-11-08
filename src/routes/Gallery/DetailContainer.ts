import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import DetailView, { DetailViewProps } from 'routes/Gallery/DetailView';
import { RootState } from 'store/reducers';
import { NavigationScreenProps } from 'react-navigation';

const mapStateToProps = (state: RootState) => ({
  //
});

// navigation.getParam('itemId', 'NO-ID')

interface OwnProps extends NavigationScreenProps {
}

const mapDispatchToProps = (dispatch: Dispatch, { navigation }: OwnProps) => ({
  navigation,
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailView);
