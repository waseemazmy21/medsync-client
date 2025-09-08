- registration form: the blod type is required (Done)
- departmetns
    - show toast if there is no avaible days for booking
    - disable not avialbe days
- Add department pagination



## ToDo
- patient appointments
    - don't allow user to submit multiple reviews
    - invalidate cache when adding or updating
        - add appointment -> invalidate upcomming appointments
        - update appointment by doctor -> invalidate all appointments
        - add review -> invalidate all completed appointmetns
