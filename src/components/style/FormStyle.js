import { red } from 'material-ui/colors'

const FormStyle = (theme) => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing.unit * 4,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  verifyEmailIcon: {
    verticalAlign: 'middle',
  },
  login: {
    textAlign: 'center',
  },
  paper: {
    padding: 16,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  avatar: {
    minWidth: theme.spacing.unit * 5,
    marginRight: theme.spacing.unit * 2,
  },
  list: {
    overflow: 'inherit',
  },
  card: {
    overflow: 'inherit',
  },
  menu: {
    cursor: 'pointer',
  },
  accountmenu: {
    flexDirection: 'row',
    display: 'flex',
    marginRight: theme.spacing.unit * 10,
    color: 'blue',
  },
  actions: {
    direction: 'rtl',
    padding: theme.spacing.unit,
    paddingBottom: theme.spacing.unit * 2,
  },
  fabButton: {
    margin: theme.spacing.unit,
  },
  shortList: {
    textAlign: 'left',
  },
  listItemTextForm: {
    // marginLeft: theme.spacing.unit * 2,
  },
  shortListDeleting: {
    textAlign: 'left',
    backgroundColor: red.A100,
  },
  formRow: {
    flexDirection: 'row',
    display: 'flex',
    marginRight: theme.spacing.unit * 10,
  },
  input: {
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
  },
  menuInput: {
    margin: theme.spacing.unit,
    cursor: 'pointer',
  },
  mumericInput: {
    margin: theme.spacing.unit,
  },
  formDivider: {
    marginRight: theme.spacing.unit * 20,
    marginLeft: theme.spacing.unit,
  },
  radioHorizontal: {
    flexDirection: 'row',
  },
  gridInList: {
    marginRight: theme.spacing.unit * 10,
  },
  verticalForm: {
    minHeight: theme.spacing.unit * 36,
  },
})

export default FormStyle
