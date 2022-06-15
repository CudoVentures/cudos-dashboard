import {
  Box,
  FormControl,
  InputBase,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  styled,
  Typography
} from '@mui/material'
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded'
import { defaultMessages } from 'ledgers/utils'

type ActivityHeaderProps = {
  filterByType: (type: string) => Promise<void>
  filter: string
}

const SelectInput = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    borderRadius: '26px',
    position: 'relative',
    backgroundColor: theme.palette.primary.main,
    border: 'none',
    minWidth: '100px',
    padding: '0.5rem 1rem',
    textTransform: 'none',
    '&:hover': {
      background:
        'linear-gradient(0deg, rgba(246, 249, 254, 0.2), rgba(246, 249, 254, 0.2)), #52A6F8'
    },
    '&:click': {
      background:
        'linear-gradient(0deg, rgba(246, 249, 254, 0.4), rgba(246, 249, 254, 0.4)), #52A6F8'
    },
    '&:focus': {
      backgroundColor: theme.palette.primary.main
    },
    '&:active': {
      backgroundColor: theme.palette.primary.main
    }
  },
  '& .MuiInputLabel-root': {
    color: 'red',
    border: '1px solid red'
  }
}))

const ActivityHeader: React.FC<ActivityHeaderProps> = ({
  filterByType = () => null,
  filter = ''
}) => {
  const options = [
    { value: '', label: '(choose filter)' },
    ...Object.entries(defaultMessages).map(([key, value]: [string, any]) => ({
      value: key.split('/').pop(),
      label: value.displayName
    }))
  ]

  const handleSelect = (e: SelectChangeEvent) => {
    const newValue = e.target.value
    filterByType(newValue)
  }

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography
        letterSpacing={1}
        fontWeight={700}
        color="text.secondary"
        textTransform="uppercase"
        fontSize="14px"
      >
        Activity
      </Typography>
      <Stack direction="row" alignItems="center" gap={1} sx={{ minWidth: 120 }}>
        <Typography variant="body2" color="text.secondary">
          Filter
        </Typography>
        <FormControl>
          <Select
            fullWidth
            IconComponent={ArrowDropDownRoundedIcon}
            value={filter}
            onChange={handleSelect}
            displayEmpty
            SelectDisplayProps={{
              defaultValue: ''
            }}
            input={<SelectInput />}
            size="small"
            sx={{
              width: '250px'
            }}
            MenuProps={{
              sx: {
                maxHeight: '300px',
                width: '250px'
              }
            }}
          >
            {options.map((o) => (
              <MenuItem value={o.value} key={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Box>
  )
}

export default ActivityHeader
