# INCOME_MANAGERMENT PROJECT
- a web applycation to manager income

## Backend project
- save in folder `/be`
### Text Stack
- Express
- MYSQL
- Typescript

### Database
- use prisma to connect mysql
- connect sql through variable in .env

#### Table
##### Admin
- username
- password
- email

##### User
- username
- password
- email

##### Workplace
- userId(user.id)
- name
- wage

##### Shift
- userId(user.id)
- time_start 
- time_end
- workplaceId(workplace.id)
- break(0.25,0.5,0.75 default 0)
- working_hours(time_end - break - time_start, snapshot)
- daily_income(working_hours*workplace.wage(if work in  22pm-5am, increase 25% ))
- working_date time_start's date

### Requirement
- must be login
- admin can view edit delete all
- admin can create user
- user just crud thier user
- user just crud thier workplace
- user just crud thier shift
- use structure route -> controller -> service -> repository

## home project
- save in folder `/home`
### Text Stack
- Nextjs
- Tailwind
- Typescript

### Requirement
- just user can login
- connect to backend through .env
### route
#### home page (`/`)
- show calendar in this month
- have button create shift(`/shift/new`)
- have button to click to show older months
- if there are no shift in day show button (+) to click (`/shift/new`) to create shift and add date to current shift
- show shift in day and click to edit shift 
#### shift page (`/shift`)
- have button to click to show older months
- show all shift in this month
- show income this month at the last row
#### create shift page (`/shift/new`)
- can select many day to create the same shift
- can edit time_start time_end
- select workplace
#### edit shift page (`/shift/id/`)
- can edit time_start time_end
- select workplace