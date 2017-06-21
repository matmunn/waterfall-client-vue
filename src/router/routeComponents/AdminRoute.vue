<template>
<div>
  <router-link to="/admin">
    <img src="/static/img/logo.svg" class="logo">
  </router-link>

  <div class="wip-link">
    Welcome back {{ userName }}<br />
    <router-link to='/'>Back to WIP</router-link>
  </div>

  <ul class="nav">
    <li class="nav-item">
      <router-link to='/overview'>Overview</router-link>
    </li>
    <li class="nav-item">
      <router-link to="/admin/tasks">Tasks List</router-link>
    </li>
    <li class="nav-item">
      <router-link to='/admin/tasks/mine'>My Tasks</router-link>
    </li>
    <li class="nav-item">
      <router-link to="/admin/tasks/add">Add Task</router-link>
    </li>
    <li class="nav-item">
      <router-link to="/admin/users">Users List</router-link>
    </li>
    <li class="nav-item">
      <router-link to="/admin/users/add">Add User</router-link>
    </li>
    <li class="nav-item">
      <router-link to="/admin/categories">Categories List</router-link>
    </li>
    <li class="nav-item">
      <router-link to="/admin/categories/add">Add Category</router-link>
    </li>
    <li class="nav-item">
      <router-link to="/admin/clients">Clients List</router-link>
    </li>
    <li class="nav-item">
      <router-link to="/admin/clients/add">Add Client</router-link>
    </li>
    <li class="nav-item">
      <router-link to='/logout'>Logout</router-link>
    </li>
  </ul>
  <router-view></router-view>
</div>
</template>

<style scoped lang="scss">
.logo {
  width: 10%;
  margin: 1vh auto 2vh;
  display: block;
  min-width: 200px;
  max-width: 300px;
}
.wip-link {
  margin: 0.8vh auto;
  text-align: center;
}
.nav {
  text-align: center;
  margin: 1vh auto;

  li {
    display: inline-block;
  }
}
</style>

<script>
import Auth from 'Auth'
export default {
  name: 'AdminRoute',
  computed: {
    userName () {
      return Auth.getUser().name
    }
  }
}
</script>
