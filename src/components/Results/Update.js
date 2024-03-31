import {
  Avatar,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  MenuList,
  Divider,
  ListItem,
  Select,
  TextField,
  Typography,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import { Box } from '@mui/system';
import Popover from '@mui/material/Popover';
import React, { useState, useEffect } from 'react';
import './Result.css';
import logo from '../../img/logo.png';
import PrintIcon from '@mui/icons-material/Print';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import nodata from '../../img/nodata.png';

import Modal from '@mui/material/Modal';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    lg: 700,
    xs: 450,
    sm: 600,
    md: 700,
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  pt: 4,
};
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
const subjects = [
  'Mathematics',
  'English Language',
  'P.H.E',
  'Christain Religious Studies',
  'Social Studies',
  'French Language',
  'Igbo Language',
  'Home Economics',
  'Basic Science',
  'Physics',
  'Music',
  'Essay',
  'History',
  'C.R.S',
  'Business Studies',
  'Phonetics ',
  'Literature-In-English',
  'Agricultural Science',
  'Basic Technology',
  'Physical Health Education',
  'Computer Science',
  'Security',
  'Cultural and Creative art',
  'Government',
  'Civic Education',
  'Chemistry',
  'Accounting',
  'Economics',
  'Marketing',
  'Animal Husbandry',
  'Biology',
  'Commerce',
  'Geography',
  'Igbo-Literature',
];

const url = 'https://ulego.ng/api/v1/teacher';
const urlGet = 'https://ulego.ng/api/v1/student';
const createUrl = 'https://ulego.ng/api/v1/course';
const getResultUrl = 'https://ulego.ng/api/v1/course/student/courses/';

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CreateSchools = () => {
  const [openSnack, setOpenSnack] = useState(false);

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };

  const USER = JSON.parse(window.localStorage.getItem('user-info'));

  const token = USER.token;
  const [success, setSuccess] = useState(false);

  const [anchorElPop, setAnchorElPop] = React.useState(null);

  const [loading, setLoading] = useState(true);
  const [teacherId, setTeacherId] = useState('');
  const [stuId, setStuId] = useState();

  const [studentList, setStudentList] = useState([]);

  const [resultData, setResultData] = useState([]);

  const [error, setError] = useState('');

  const [allStudents, setAllStudents] = useState([]);

  const [staff, setStaff] = useState([]);

  const [openModal, setOpenModal] = React.useState(false);

  const [openResult, setOpenResult] = useState(false);

  const [selectedSubject, setSelectedSubject] = useState();

  const [student_id, setStudentId] = useState();

  const [course_name, setCourseName] = useState('');

  const [test_score, setTextScore] = useState();

  const [first_class_test, setFirstClassTest] = useState();

  const [second_class_test, setsecond_class_test] = useState();

  const [mid_term_test, setmid_term_test] = useState();

  const [projects, setprojects] = useState();

  const [resumption_test, setresumption_test] = useState();
  const [assignment, setAss] = useState();

  const [term, setTerm] = useState();

  const [exam_score, setExamScore] = useState();

  const [grade, setGrade] = useState('');

  const [selectedClass, setClass] = useState('JSS-1');

  // const [total, setTotal] = useState('');

  const [student_fullName, setStudentFullName] = useState('');

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [filteredStudents, setFilteredStudents] = useState([]);

  const [resultCourse, setResultCourse] = useState([]);

  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------

  const total = parseFloat(test_score) + parseFloat(exam_score);
  const handleClickPop = (event) => {
    setAnchorElPop(event.currentTarget);
  };

  const handleClosePop = () => {
    setAnchorElPop(null);
  };

  const openPop = Boolean(anchorElPop);

  const pop_id = openPop ? 'simple-popover' : undefined;

  const handleCloseResult = () => {
    setOpenResult(false);
  };

  const handleOpenModal = (e, firstName, secondName, id) => {
    setOpenModal(true);
    setSelectedSubject(e.target.value);

    setStudentFullName(firstName + ' ' + secondName);
    setStudentId(id);
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleChange = (event) => {
    setClass(event.target.value);
    // console.log(stuclass);
  };

  const filterStudentsByClass = () => {
    const filtered = allStudents.filter((student) => student.className === selectedClass);
    setFilteredStudents(filtered);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSuccess(false);
  };

  const open = Boolean(anchorEl);
  const admin = JSON.parse(localStorage.getItem('user-info'));

  console.log(admin.data.isAdmin);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      // console.log(data);
      setLoading(false);
      setStaff(data);
    } catch (err) {
      setLoading(false);
    }
  };

  const getStudentResult = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(getResultUrl + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setResultData(data.data[0].report);
      console.log(resultData, '=>NEw Sammy');
      setLoading(false);
      setOpenResult(true);
      setSelectedSubject(e.target.value);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const USER = JSON.parse(window.localStorage.getItem('user-info'));

    const token = USER.token;
    setLoading(true);
    try {
      const response = await fetch('https://ulego.ng/api/v1/course/' + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      // console.log(id, "gggg")
      // window.location.reload(true);
      handleCloseResult();
      handleClosePop();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchStudent = async (id) => {
    setLoading(true);
    setTeacherId(id);
    try {
      const response = await fetch(urlGet, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setLoading(false);
      setAllStudents(data.data);
      setStudentList(data.data);
      console.log(studentList);
    } catch (err) {
      setLoading(false);
    }
  };

  const fetchTeacherCourse = async (id) => {
    if (admin.data.isAdmin === true) {
      setResultCourse(subjects);
    } else {
      setTeacherId(id);
      try {
        const response = await fetch(`https://ulego.ng/api/v1/course/teacher/course/courses/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        // setLoading(false);
        console.log(data.courses);
        setResultCourse(data.courses);
        // console.log(studentList);
      } catch (err) {
        // setLoading(false);
      }
    }
  };

  useEffect(() => {
    // if (admin.data.isAdmin === true) {
    //   fetchStaff();
    // } else {
    fetchTeacherCourse(admin.data.id);
    fetchStudent(admin.data.id);
    // }
  }, []);

  const handleCreateResult = async () => {
    setLoading(true);
    // e.preventDefault();

    try {
      const item = {
        course_name,
        term,
        first_class_test,
        resumption_test,
        second_class_test,
        assignment,
        projects,
        mid_term_test,
        grade,
        // total,
        test_score,
        exam_score,
        student_fullName,
        student_id,
        // teacherId,
      };
      let result = await fetch(createUrl, {
        method: 'POST',
        body: JSON.stringify(item),
        headers: {
          'Content-Type': 'application/json ',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      result = await result.json();
      setOpenSnack(true);
      console.log('result', result);
      setLoading(false);
      setCourseName(' ');
      setGrade(' ');
      setTextScore(' ');
      setFirstClassTest(' ');
      setprojects(' ');
      setsecond_class_test(' ');
      setmid_term_test(' ');
      setAss(' ');
      setresumption_test(' ');
      setTerm(' ');
      setExamScore(' ');
      setTotal(' ');
      setSuccess(true);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    filterStudentsByClass();
  }, [selectedClass, allStudents]);

  // console.log('Dominion ', staff.data);

  return (
    <Box sx={{ borderRadius: '30px' }}>
      <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Result Created Successfully
        </Alert>
      </Snackbar>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="demo-simple-select-label" sx={{ fontSize: '16px' }}>
          Select Class
        </InputLabel>
        <Select
          mb={3}
          value={`${selectedClass}`}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          variant="standard"
          size="small"
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value="JSS-1" sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
              JSS-1
            </Typography>
          </MenuItem>
          <MenuItem value="JSS-2" sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
              JSS-2
            </Typography>
          </MenuItem>
          <MenuItem value="JSS-3" sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
              JSS-3
            </Typography>
          </MenuItem>
          <MenuItem value="SSS-1" sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
              SSS-1
            </Typography>
          </MenuItem>
          <MenuItem value="SSS-2" sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
              SSS-2
            </Typography>
          </MenuItem>
          <MenuItem value="SSS-3" sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
              SSS-3
            </Typography>
          </MenuItem>
        </Select>
      </FormControl>

      {filteredStudents.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={nodata} alt="no-data" width="50%" />
        </Box>
      ) : (
        <Box sx={{ p: 3, mb: 1 }}>
          <Grid container spacing={2}>
            {filteredStudents.map((data, index) => (
              <Grid item lg={3} md={3} sm={6} key={data.id}>
                <Box
                  sx={{
                    border: '1px solid #808080',
                    borderRadius: '10px',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Avatar />
                  <Box sx={{ mt: 1, textAlign: 'center' }}>
                    <Typography variant="body" sx={{ fontWeight: 'bolder', fontSize: '12px', textAlign: 'center' }}>
                      {data.firstName} {data.surname}
                    </Typography>
                    <br />
                    <Typography variant="body" sx={{ fontSize: '9px' }}>
                      {data.email}
                    </Typography>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ mb: 1, mt: 2 }}
                      value={`${data.firstName} ${data.surname} - ID: ${data.id}`}
                      onClick={(e) => handleOpenModal(e, data.firstName, data.surname, data.id)}
                    >
                      Create Result
                    </Button>
                    <Button
                      variant="contained"
                      value={`${data.firstName} ${data.surname} - ID: ${data.id}`}
                      onClick={(e) => {
                        getStudentResult(data.id);
                        setSelectedSubject(e.target.value);
                      }}
                      fullWidth
                    >
                      Get Result
                    </Button>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* ------------------------------------------------------------------------------------------------------------------- */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ textAlign: 'right', mb: 2 }}>
            <IconButton onClick={handleCloseModal}>
              <HighlightOffIcon sx={{ fontSize: '30px' }} />
            </IconButton>
          </Box>
          <Box
            sx={{
              borderRadius: '20px',
              display: 'flex',
              justifyContent: 'space-around',
              width: '70%',
              p: 1,
              bgcolor: '#051e34',
              color: '#fff',
            }}
          >
            <Typography variant="body">{selectedSubject}</Typography>
          </Box>
          <Box sx={{ border: '1px solid #051e34', width: '100%', height: '400px', my: 2, overflowY: 'scroll', p: 2 }}>

          <FormControl sx={{ m: 1, minWidth: 600 }} size="small">
                <InputLabel id="demo-select-small-label">Term</InputLabel>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={term}
                  label="Term"
                  onChange={(e) => setTerm(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Term</em>
                  </MenuItem>
                  <MenuItem value={'first-term'}>First Term</MenuItem>
                  <MenuItem value={'second-term'}>Second Term</MenuItem>
                  <MenuItem value={'third-term'}>Third Term</MenuItem>
                </Select>
              </FormControl>
            <Grid container spacing={2}>
             
              {/* <TextField
                fullWidth
                variant="outlined"
                label="Term"
                margin="normal"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              /> */}
              <Grid item lg={6} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={resultCourse}
                  fullWidth
                  value={course_name}
                  onChange={(event, newValue) => {
                    setCourseName(newValue);
                  }}
                  inputValue={course_name}
                  onInputChange={(event, newInputValue) => {
                    setCourseName(newInputValue);
                  }}
                  renderInput={(params) => <TextField {...params} label="Course Name" />}
                />
              </Grid>
              <Grid item lg={6} xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="First Test Score"
                  margin="normal"
                  type="number"
                  value={first_class_test}
                  onChange={(e) => setFirstClassTest(e.target.value)}
                />
              </Grid>
              <Grid item lg={6} xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Second Test Score"
                  margin="normal"
                  type="number"
                  value={second_class_test}
                  onChange={(e) => setsecond_class_test(e.target.value)}
                />
              </Grid>
              <Grid item lg={6} xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Assignments"
                  margin="normal"
                  type="number"
                  value={assignment}
                  onChange={(e) => setAss(e.target.value)}
                />
              </Grid>
              <Grid item lg={6} xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Resumption Test"
                  margin="normal"
                  type="number"
                  value={resumption_test}
                  onChange={(e) => setresumption_test(e.target.value)}
                />
              </Grid>
              <Grid item lg={6} xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Mid Term Test"
                  margin="normal"
                  type="number"
                  value={mid_term_test}
                  onChange={(e) => setmid_term_test(e.target.value)}
                />
              </Grid>
              <Grid item lg={6} xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="projectss"
                  margin="normal"
                  type="number"
                  value={projects}
                  onChange={(e) => setprojects(e.target.value)}
                />
              </Grid>
              <Grid item lg={6} xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Exam Score"
                  margin="normal"
                  type="number"
                  value={exam_score}
                  onChange={(e) => setExamScore(e.target.value)}
                />
              </Grid>

              <Grid item lg={6} xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Student-ID"
                  margin="normal"
                  helperText="copy the student ID displayed at the top"
                  value={student_id}
                  onChange={(e) => setStudentId(e.target.value)}
                />
              </Grid>
              <Grid item lg={6} xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Student Full Name"
                  margin="normal"
                  helperText=" copy the student fullname displayed at the top"
                  value={student_fullName}
                  onChange={(e) => setStudentFullName(e.target.value)}
                />
              </Grid>
              <Grid item lg={6} xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Remarks"
                  margin="normal"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'right', width: '90%' }}>
            {!loading && (
              <LoadingButton fullWidth size="large" type="submit" onClick={handleCreateResult} variant="contained">
                Add Result
              </LoadingButton>
            )}
            {loading && (
              <LoadingButton
                loading
                loadingPosition="start"
                startIcon={<SaveIcon />}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                disabled
              >
                Creating Result
              </LoadingButton>
            )}
          </Box>
        </Box>
      </Modal>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 4 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Modal
        open={openResult}
        onClose={handleCloseResult}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ textAlign: 'right', mb: 2 }}>
            <IconButton onClick={handleCloseResult}>
              <HighlightOffIcon sx={{ fontSize: '30px' }} />
            </IconButton>
          </Box>
          <Box
            sx={{
              borderRadius: '20px',
              display: 'flex',
              justifyContent: 'space-around',
              width: '70%',
              p: 1,
              bgcolor: '#051e34',
              color: '#fff',
            }}
          >
            <Typography variant="body">{selectedSubject}</Typography>
          </Box>
          {resultData.length === 0 ? (
            <Box>No Result...</Box>
          ) : (
            <Box sx={{ overflowY: 'scroll', height: '80vh' }}>
              <Table>
                <TableHead>
                  <TableCell sx={{ fontWeight: 'bolder' }}>S/N</TableCell>
                  <TableCell sx={{ fontWeight: 'bolder' }}>Subject</TableCell>
                  <TableCell sx={{ fontWeight: 'bolder' }}>C.A Score</TableCell>
                  <TableCell sx={{ fontWeight: 'bolder' }}>Exam Score</TableCell>
                  <TableCell sx={{ fontWeight: 'bolder' }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 'bolder' }}>Grade</TableCell>
                  <TableCell align="right"></TableCell>
                </TableHead>
                <TableBody>
                  {resultData.map((data, index) => (
                    <TableRow hover key={data.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.course_name}</TableCell>
                      <TableCell>{data.test_score}</TableCell>
                      <TableCell>{data.exam_score}</TableCell>
                      <TableCell>{data.total}</TableCell>
                      <TableCell>{data.grade}</TableCell>
                      <TableCell key={data.id} onClick={() => setStuId(data.id)}>
                        <IconButton onClick={handleClickPop}>
                          <DeleteForeverIcon color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Box>
      </Modal>
      <Popover
        id={pop_id}
        open={openPop}
        anchorEl={anchorElPop}
        onClose={handleClosePop}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Typography sx={{ p: 2 }}>Are you sure?</Typography>
        <Button sx={{ color: 'error' }} onClick={() => handleDelete(stuId)}>
          Yes
        </Button>
        <Button onClick={handleClosePop}>No</Button>
      </Popover>
      <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleCloseSnack}>
        <Alert onClose={handleCloseSnack} severity="success" sx={{ width: '100%' }}>
          Result Created Successfully
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateSchools;

const subjectList = [
  { label: 'Mathematics' },
  { label: 'English Language' },
  { label: 'P.H.E' },
  { label: 'Christain Religious Studies' },
  { label: 'Social Studies' },
  { label: 'French Language' },
  { label: 'Igbo Language' },
  { label: 'Home Economics' },
  { label: 'Basic Science' },
  { label: 'Physics' },
  { label: 'Music' },
  { label: 'Essay' },
  { label: 'History' },
  { label: 'C.R.S' },
  { label: 'Business Studies' },
  { label: 'Phonetics ' },
  { label: 'Literature-In-English' },
  { label: 'Agricultural Science' },
  { label: 'Basic Technology' },
  { label: 'Physical Health Education' },
  { label: 'Computer Science' },
  { label: 'Security' },
  { label: 'Cultural and Creative art' },
  { label: 'Government' },
  { label: 'Civic Education' },
  { label: 'Chemistry' },
  { label: 'Accounting' },
  { label: 'Economics' },
  { label: 'Marketing' },
  { label: 'Animal Husbandry' },
  { label: 'Biology' },
  { label: 'Commerce' },
  { label: 'Geography' },
  { label: 'Igbo-Literature' },
];
