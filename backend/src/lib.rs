#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }

    #[test]
    fn abc_test() {
        let abc = "abc";
        assert_eq!(abc.len(), 3);
        assert!(abc.starts_with('a'));
        assert!(abc.ends_with('c'));
    }
}
