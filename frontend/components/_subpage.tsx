import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { MantineProvider, AppShell, Navbar, Header, NavLink, Aside, Footer } from '@mantine/core';

type SubpageLayoutProps = {
  children: React.ReactNode
}

function SubpageLayout ({children}: SubpageLayoutProps) {
  const router = useRouter();
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
      /** Put your mantine theme override here */
      colorScheme: 'dark',
    }}>
        <AppShell
          padding="md"
          fixed={false}
          navbar={<Navbar width={{ base: 300 }} p="xs">
            <Navbar.Section grow mt="md">
              <Link href="/prices" passHref>
                <NavLink component="a" label="Prices" active={router.pathname === '/prices'}/>
              </Link>
              <Link href="/retire" passHref>
                <NavLink component="a" label="Retire" active={router.pathname === '/retire'}/>
              </Link>
            </Navbar.Section>
          </Navbar>}
          header={<Header height="100" px="20" p="xs"><h1>Group 10</h1></Header>}
          styles={(theme) => ({
            main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
          })}    
        >
          {children}
        </AppShell>
    </MantineProvider>
  );
}

export default SubpageLayout;